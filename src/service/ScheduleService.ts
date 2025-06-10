import Interceptor from "./Interceptor";

export interface Schedule {
    day: number;
    discipline_id: number;
    end_time: Date;
    end_time_num: number;
    group_id: number;
    room_id: number;
    start_time: Date;
    start_time_num: number;
    teacher_id: number;
    title: string;
}

export interface ScheduleResponse {
    data: Schedule[];
    total: number;
}

class ScheduleService {
    private static instance: ScheduleService;
    private interceptor = Interceptor.getInstance();

    private constructor() {}

    public static getInstance(): ScheduleService {
        if (!ScheduleService.instance) {
            ScheduleService.instance = new ScheduleService();
        }
        return ScheduleService.instance;
    }

    public async getSchedule(): Promise<ScheduleResponse> {
        try {
            const response = await this.interceptor.getAxiosInstance().get<ScheduleResponse>(`/edu/schedule`);
            return response.data;
        } catch (error) {
            console.error('Error fetching schedule:', error);
            throw error;
        }
    }
}

export default ScheduleService;
