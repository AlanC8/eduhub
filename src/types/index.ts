export type Role = "student" | "teacher" | "admin";

export interface LoginApiResponse {
  data: {
    role: Role;
    token: string;
    user_id: number;
  };
}

export interface LoginFormState {
    login: string;
    password: string;
}

// Users API Types
export interface User {
  data: Record<string, any>;
  enabled: boolean;
  fio: string;
  is_admin: boolean;
  is_service: boolean;
  is_student: boolean;
  local: boolean;
  login: string;
  password: string;
  position: string;
  sid: string;
  user_id: number;
}

export interface UsersListResponse {
  data: User[];
  total: number;
}

export interface UserDetailResponse {
  data: User;
}

// Groups API Types
export interface Group {
  author: string;
  author_modified: string;
  created: string;
  description: string;
  educational_program_id: number | null;
  enabled: boolean;
  group_id: number;
  is_main_group: boolean;
  is_study_group: boolean;
  modified: string;
  title: string;
}

export interface GroupCreateRequest {
  author: string;
  author_modified: string;
  description: string;
  educational_program_id: number | null;
  enabled: boolean;
  is_main_group: boolean;
  is_study_group: boolean;
  title: string;
}

export interface GroupsListResponse {
  data: Group[];
  total: number;
}

export interface GroupDetailResponse {
  data: Group;
}

export interface GroupUsersResponse {
  data: User[];
  total: number;
}

export interface UserGroupsResponse {
  data: Group[];
  total: number;
}

// Educational Programs API Types
export interface EducationalProgram {
  author: string;
  author_modified: string;
  created: string;
  department_id: number;
  description: string;
  educational_program_id: number;
  enabled: boolean;
  modified: string;
  title: string;
}

export interface EducationalProgramsListResponse {
  data: EducationalProgram[];
  total: number;
}

export interface EducationalProgramDetailResponse {
  data: EducationalProgram;
}

export interface EducationalProgramCreateRequest {
  author: string;
  author_modified: string;
  department_id: number;
  description: string;
  enabled: boolean;
  title: string;
}

// Disciplines API Types
export interface Discipline {
  author: string;
  author_modified: string;
  computer: boolean;
  created: string;
  description: string;
  discipline_id: number;
  educational_program_id: number;
  enabled: boolean;
  labs: number;
  lectures: number;
  modified: string;
  online: boolean;
  practices: number;
  title: string;
}

export interface DisciplinesListResponse {
  data: Discipline[];
  total: number;
}

export interface DisciplineDetailResponse {
  data: Discipline;
}

export interface DisciplineCreateRequest {
  author: string;
  author_modified: string;
  computer: boolean;
  description: string;
  educational_program_id: number;
  enabled: boolean;
  labs: number;
  lectures: number;
  online: boolean;
  practices: number;
  title: string;
}

// Re-export assignments types
export * from './assignments';