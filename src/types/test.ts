export interface QuestionOption {
  questionOptionId: number;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  questionId: number;
  text: string;
  options: QuestionOption[];
}

export interface Test {
  testId: number;
  educatorId: number;
  educatorFullName: string;
  disciplineId: number;
  groupIds: number[];
  title: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  questions: Question[];
}

export interface TestSubmission {
  testId: number;
  studentId: number;
  answers: {
    questionId: number;
    selectedOptionId: number;
  }[];
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  details: {
    questionId: number;
    isCorrect: boolean;
    correctOptionId: number;
    selectedOptionId: number;
  }[];
}

export interface CreateTestRequest {
  educatorId: number;
  disciplineId: number;
  groupIds: number[];
  title: string;
  startTime: string;
  endTime: string;
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
} 