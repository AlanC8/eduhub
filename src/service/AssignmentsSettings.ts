// services/assignments/AssignmentsService.ts
import Interceptor from '@/service/Interceptor';
import type { Assignment, AssignmentFilter, ApiResponse, Submission } from '@/types';

// Ключ для localStorage
const USER_ID_LS_KEY = 'userId'; // Используем 'userId'

class AssignmentsService {
  private static instance: AssignmentsService;
  private interceptor = Interceptor.getInstance();

  private constructor() {}

  public static getInstance(): AssignmentsService {
    if (!AssignmentsService.instance) {
      AssignmentsService.instance = new AssignmentsService();
    }
    return AssignmentsService.instance;
  }

  private getUserIdFromLocalStorage(): number | null {
    if (typeof window !== 'undefined') {
      const userIdStr = localStorage.getItem(USER_ID_LS_KEY);
      if (userIdStr) {
        const userIdNum = parseInt(userIdStr, 10);
        return !isNaN(userIdNum) ? userIdNum : null;
      }
    }
    return null;
  }

  /**
   * Получить список заданий для студента.
   * studentId здесь - это ID студента, для которого запрашиваются задания (может быть текущий userId или другой)
   */
  public async getAssignments(studentId: number, disciplineId: number, filter: AssignmentFilter = 'all'): Promise<ApiResponse<Assignment[]>> {
    const response = await this.interceptor.getAxiosInstance().get<ApiResponse<Assignment[]>>(
      `/assignments/students/${studentId}?disciplineId=${disciplineId}&filter=${filter}`
    );
    
    if (response.data && response.data.data) {
      // Предполагаем, что API возвращает submissions для студента, указанного в studentId запроса
      response.data.data = response.data.data.map((assignment: Assignment) => {
        // Если API всегда возвращает сабмишены ТОЛЬКО для studentId из URL, то первый сабмишен - это то, что нам нужно.
        const currentUserSubmission = assignment.submissions && assignment.submissions.length > 0 
                                      ? assignment.submissions[0] 
                                      : null;
        return {
          ...assignment,
          currentUserSubmission
        };
      });
    }
    return response.data;
  }

  /**
   * Получить детали задания по ID.
   * Для определения currentUserSubmission используется userId из localStorage.
   */
  public async getAssignmentById(assignmentId: number): Promise<ApiResponse<Assignment>> {
    const currentUserId = this.getUserIdFromLocalStorage(); // Используем userId для currentUserSubmission
    
    const response = await this.interceptor.getAxiosInstance().get<ApiResponse<Assignment>>(`/assignments/${assignmentId}`);
    
    if (response.data && response.data.data) {
      if (currentUserId && response.data.data.submissions) {
        // Ищем сабмишен, где studentId совпадает с currentUserId
        const currentUserSubmission = response.data.data.submissions.find((sub: Submission) => sub.studentId === currentUserId) || null;
        response.data.data.currentUserSubmission = currentUserSubmission;
      } else if (response.data.data.submissions && response.data.data.submissions.length > 0 && !currentUserId) {
        // Если userId не найден, но есть submissions, можно взять первый (если это логично для вашего случая)
        // или установить в null. Для студенческого портала, если userId нет, то и currentUserSubmission быть не должно.
        response.data.data.currentUserSubmission = null; 
      } else {
        response.data.data.currentUserSubmission = null;
      }
    }
    return response.data;
  }

  public async downloadFile(fileId: number): Promise<Blob> {
    const response = await this.interceptor.getAxiosInstance().get(`/assignments/files/${fileId}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Отправить задание от имени текущего пользователя (userId из localStorage).
   */
  public async submitAssignment(assignmentId: number, comment: string | null, files: File[] | null): Promise<ApiResponse<Submission>> {
    const currentUserId = this.getUserIdFromLocalStorage(); // userId текущего пользователя
    if (!currentUserId) {
      console.error("User ID not found in localStorage for submitAssignment");
      throw new Error("User ID is required for submission and not found.");
    }

    const formData = new FormData();
    if (comment) {
      formData.append('comment', comment);
    }
    if (files) {
      Array.from(files).forEach(file => {
        formData.append('files', file, file.name);
      });
    }
    // studentId (currentUserId) передается в URL, как указано в вашем API
    // POST /assignments/{assignmentId}/students/{studentId}/submissions (где studentId это currentUserId)

    const response = await this.interceptor.getAxiosInstance().post<ApiResponse<Submission>>(
        `/assignments/${assignmentId}/students/${currentUserId}/submissions`, 
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
  }

  /**
   * Удалить задание по ID
   * DELETE /assignments/{id}
   */
  public async deleteAssignment(assignmentId: number): Promise<void> {
    const response = await this.interceptor.getAxiosInstance().delete(`/assignments/${assignmentId}`);
    if (response.status !== 204) {
      throw new Error('Failed to delete assignment');
    }
  }
}

export default AssignmentsService;