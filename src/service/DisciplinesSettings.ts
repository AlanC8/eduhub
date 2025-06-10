import Interceptor from './Interceptor';
import { 
  DisciplinesListResponse, 
  DisciplineDetailResponse, 
  DisciplineCreateRequest,
  EducationalProgramsListResponse,
  EducationalProgramDetailResponse,
  EducationalProgramCreateRequest
} from '../types';

class DisciplinesSettings {
  private static instance: DisciplinesSettings;
  private interceptor = Interceptor.getInstance();

  private constructor() {}

  public static getInstance(): DisciplinesSettings {
    if (!DisciplinesSettings.instance) {
      DisciplinesSettings.instance = new DisciplinesSettings();
    }
    return DisciplinesSettings.instance;
  }

  // === DISCIPLINES ===

  /**
   * Получить список всех дисциплин
   * GET /edu/disciplines
   */
  public async getAllDisciplines(): Promise<DisciplinesListResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<DisciplinesListResponse>('/edu/disciplines');
      return response.data;
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      throw error;
    }
  }

  /**
   * Получить дисциплину по ID
   * GET /edu/disciplines/{id}
   */
  public async getDisciplineById(disciplineId: number): Promise<DisciplineDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<DisciplineDetailResponse>(`/edu/disciplines/${disciplineId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching discipline ${disciplineId}:`, error);
      throw error;
    }
  }

  /**
   * Создать новую дисциплину
   * POST /edu/disciplines
   */
  public async createDiscipline(disciplineData: DisciplineCreateRequest): Promise<DisciplineDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().post<DisciplineDetailResponse>('/edu/disciplines', disciplineData);
      return response.data;
    } catch (error) {
      console.error('Error creating discipline:', error);
      throw error;
    }
  }

  /**
   * Обновить дисциплину
   * PUT /edu/disciplines/{id}
   */
  public async updateDiscipline(disciplineId: number, disciplineData: Partial<DisciplineCreateRequest>): Promise<DisciplineDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().put<DisciplineDetailResponse>(`/edu/disciplines/${disciplineId}`, disciplineData);
      return response.data;
    } catch (error) {
      console.error(`Error updating discipline ${disciplineId}:`, error);
      throw error;
    }
  }

  /**
   * Удалить дисциплину
   * DELETE /edu/disciplines/{id}
   */
  public async deleteDiscipline(disciplineId: number): Promise<void> {
    try {
      await this.interceptor.getAxiosInstance().delete(`/edu/disciplines/${disciplineId}`);
    } catch (error) {
      console.error(`Error deleting discipline ${disciplineId}:`, error);
      throw error;
    }
  }

  // === EDUCATIONAL PROGRAMS ===

  /**
   * Получить список всех образовательных программ
   * GET /edu/educational_programs
   */
  public async getAllEducationalPrograms(): Promise<EducationalProgramsListResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<EducationalProgramsListResponse>('/edu/educational_programs');
      return response.data;
    } catch (error) {
      console.error('Error fetching educational programs:', error);
      throw error;
    }
  }

  /**
   * Получить образовательную программу по ID
   * GET /edu/educational_programs/{id}
   */
  public async getEducationalProgramById(programId: number): Promise<EducationalProgramDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<EducationalProgramDetailResponse>(`/edu/educational_programs/${programId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching educational program ${programId}:`, error);
      throw error;
    }
  }

  /**
   * Создать новую образовательную программу
   * POST /edu/educational_programs
   */
  public async createEducationalProgram(programData: EducationalProgramCreateRequest): Promise<EducationalProgramDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().post<EducationalProgramDetailResponse>('/edu/educational_programs', programData);
      return response.data;
    } catch (error) {
      console.error('Error creating educational program:', error);
      throw error;
    }
  }

  /**
   * Обновить образовательную программу
   * PUT /edu/educational_programs/{id}
   */
  public async updateEducationalProgram(programId: number, programData: Partial<EducationalProgramCreateRequest>): Promise<EducationalProgramDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().put<EducationalProgramDetailResponse>(`/edu/educational_programs/${programId}`, programData);
      return response.data;
    } catch (error) {
      console.error(`Error updating educational program ${programId}:`, error);
      throw error;
    }
  }

  /**
   * Удалить образовательную программу
   * DELETE /edu/educational_programs/{id}
   */
  public async deleteEducationalProgram(programId: number): Promise<void> {
    try {
      await this.interceptor.getAxiosInstance().delete(`/edu/educational_programs/${programId}`);
    } catch (error) {
      console.error(`Error deleting educational program ${programId}:`, error);
      throw error;
    }
  }
}

export default DisciplinesSettings;
