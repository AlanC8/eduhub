import { ApiResponse, Test, CreateTestRequest } from '@/types/test';

const API_BASE_URL = 'http://26.51.163.74:8082';

export const testService = {
  async getTestById(testId: number): Promise<Test> {
    const response = await fetch(`${API_BASE_URL}/testing/${testId}`, {
      headers: {
        'accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Test> = await response.json();
    return result.data;
  },

  async createTest(test: CreateTestRequest): Promise<Test> {
    const response = await fetch(`${API_BASE_URL}/testing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(test)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Test> = await response.json();
    return result.data;
  }
}; 