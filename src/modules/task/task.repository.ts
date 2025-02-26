
import { prisma } from "../../prismaClient";


class TaskRepository {

    /* (================) ||  CREATE NEW TASK || (===============) */
    public static async createNewTaskRepository(userId: number, title: string, description: string) {
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



    /* (================) ||  UPDATE  TASK || (===============) */
    public static async updateTaskRepository(userId: number, id: number, title: string, description: string, isCompleted: boolean) {
        try {
            let task = await prisma.tasks.update({
                where: {
                    id: id,
                    userId: userId
                },
                data: {
                    title: title,
                    description: description,
                    isCompleted: isCompleted,
                    updatedAt: new Date()
                }
            });
            return task;
        } catch (error: any) {
            throw new Error("Failed to UPDATAE task" + error.message);

        }
    }

    /* (================) ||  DELETE  TASK || (===============) */
    public static async deleteTaskRepository(id: number) {
        try {
            let task = await prisma.tasks.delete({
                where: {
                    id: id,
                }
            });
            return task;
        } catch (error: any) {
            throw new Error("Failed to DELETE task" + error.message);

        }
    }
    /* (================) ||  find  TASK || (===============) */
    public static async getTaskByIdRepository(id: number) {
        try {
            let task = await prisma.tasks.findUnique
                ({
                    where: {
                        id: id,
                    }
                });
            return task;
        } catch (error: any) {
            throw new Error("Failed to DELETE task" + error.message);

        }
    }



    /* (================) ||  GET LIST  OF TASK By ADMIN || (===============) */
    public static async getTaskListByAdminRepository(page: number, limit: number) {
        try {
            let task = await prisma.tasks.findMany({
                skip: (page - 1) * limit,
                take: limit
            });
            return task;
        } catch (error: any) {
            throw new Error("Failed to GET task LIST" + error.message);


        }
    }
    /* (================) ||  GET LIST  OF TASK BY USER || (===============) */
    public static async getTaskListByUserRepository(userId: number, page: number, limit: number) {
        try {
            let task = await prisma.tasks.findMany({
                where: {
                    userId: userId
                },
                skip: (page - 1) * limit,
                take: limit
            });
            return task;
        } catch (error: any) {
            throw new Error("Failed to GET task LIST" + error.message);


        }
    }








}

export default TaskRepository;