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