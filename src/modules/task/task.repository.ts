
import { prisma } from "../../prismaClient";


class TaskRepository {

    /* (================) ||  CREATE NEW TASK || (===============) */
    public static async createNewTask(userId: number, title: string, description: string) {
        try {
            let task = await prisma.tasks.create({
                data: {
                    title,
                    description,
                    userId
                }
            });
            return task;
        } catch (error: any) {
            throw new Error("Failed to create task" + error.message);

        }
    }
    /* (================) ||  UPDATE NEW TASK || (===============) */
    public static async updateTask(id: number, title: string, description: string, isCompleted: boolean, userId: number) {
        try {
            let task = await prisma.tasks.updae({
                where: {
                    id: id,
                    userId: userId
                }
                data: {
                    title: title,
                    description: description,
                    isCompleted: isCompleted
                }
            });
            return task;
        } catch (error: any) {
            throw new Error("Failed to create task" + error.message);

        }
    }

}

export default TaskRepository;