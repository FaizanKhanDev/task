import TaskRepository from "./task.repository";




class TaskServices {


    /* (================) ||  CREATE NEW TASK || (===============) */
    public static async createNewTaskService(user: any, title: string, description: string) {
        try {
            let result = await TaskRepository.createNewTaskRepository(user.id, title, description);
            return result;
        } catch (error: any) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }


    /* (================) ||  UPDATE TASK || (===============) */
    public static async updateTaskService(user: any, id: number, title: string, description: string, isCompleted: boolean) {
        try {
            let result = await TaskRepository.updateTaskRepository(user.id, id, title, description, isCompleted);
            return result;
        } catch (error: any) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }


    /* (================) ||  DELETE TASK || (===============) */
    public static async deleteTaskService(id: number) {
        try {
            let findTask = await TaskRepository.getTaskByIdRepository(id);
            if (!findTask) {
                throw new Error("Task not found");
            }

            let result = await TaskRepository.deleteTaskRepository(id);
            return result;
        } catch (error: any) {
            throw new Error("Failed to DELETE task" + error.message);

        }
    }

    /* (================) ||  GET LIST  OF TASK By ADMIN || (===============) */
    public static async getTaskListByAdminService(page: number, limit: number) {
        try {
            let result = await TaskRepository.getTaskListByAdminRepository(page, limit);
            return result;

        } catch (error: any) {
            throw new Error("Failed to GET task LIST" + error.message);

        }
    }
    /* (================) ||  GET LIST  OF TASK By user || (===============) */
    public static async getTaskListByUserService(user: any, page: number, limit: number) {
        try {
            let result = await TaskRepository.getTaskListByUserRepository(user.id, page, limit);
            return result;

        } catch (error: any) {
            throw new Error("Failed to GET task LIST" + error.message);

        }
    }

}


export default TaskServices;