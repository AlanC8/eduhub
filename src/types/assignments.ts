
export interface AssignmentFile {
  fileId: number;
  filename: string;
}

export interface SubmissionFile extends AssignmentFile {}

export interface Submission {
  submissionId: number;
  assignmentId: number;
  studentId: number;
  studentFullName: string;
  comment: string | null;
  files: SubmissionFile[];
  submittedAt: string;
  isLate: boolean;
  reviewedAt: string | null;
  grade: number | null;
  feedback: string | null;
  status?: 'LATE' | 'SUBMITTED_ON_TIME' | 'NOT_SUBMITTED' | 'REVIEWED';
}

export interface Assignment {
  assignmentId: number;
  educatorId: number;
  educatorName: string;
  title: string;
  description: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  files: AssignmentFile[];
  disciplineId: number;
  studyGroupsId: number[];
  submissions: Submission[] | null;
  currentUserSubmission: Submission | null;
  statusForCurrentUser?: 'upcoming' | 'late' | 'completed' | 'graded';
}

export type AssignmentFilter = 'upcoming' | 'late' | 'completed' | 'all';

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
} 