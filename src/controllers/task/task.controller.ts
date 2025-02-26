import { Request, Response } from "express";
import { errorHandler } from "../../middlewares/error.middleware";
import { AuthRequest } from "../../interfaces";
import TaskServices from "../../modules/task/task.service";
import { SetDataTypes } from "../../helpers";

class TaskController {


    /* (================) ||  CREATE NEW TASK || (===============) */
    public static async createNewTask(req: AuthRequest, res: Response) {
        try {
            let { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                    data: []
                });
            }

            let response = await TaskServices.createNewTaskService(req.user, title, description);


            if (!response) {
                return res.status(404).send({
                    message: "failed to create task",
                    status: "error",
                    data: []
                });
            }

            return res.status(200).send({
                data: response,
                status: "success",
                message: "task created successfully"
            });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }

    /* (================) ||  UPDATE TASK || (===============) */
    public static async updateTask(req: AuthRequest, res: Response) {
        try {
            let { id, title, description, isCompleted } = req.body;

            if (!id || !title || !description || !isCompleted) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                    data: []
                });
            }

            let response = await TaskServices.updateTaskService(req.user, id, title, description, isCompleted);


            if (!response) {
                return res.status(404).send({
                    message: "failed to update task",
                    status: "error",
                    data: []
                });
            }

            return res.status(200).send({
                data: response,
                status: "success",
                message: "task updated successfully"
            });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }

    /* (================) ||  DELETE TASK || (===============) */
    public static async deleteTask(req: AuthRequest, res: Response) {
        try {
            let { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                    data: []
                });
            }

            let response = await TaskServices.deleteTaskService(SetDataTypes.parseInt(id));


            if (!response) {
                return res.status(404).send({
                    message: "failed to delete task",
                    status: "error",
                    data: []
                });
            }

            return res.status(200).send({
                data: response,
                status: "success",
                message: "task delete successfully"
            });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }
    /* (================) ||  GET LIST TASK BY ID || (===============) */
    public static async getTaskListByAdmin(req: AuthRequest, res: Response) {
        try {
            let { page = 1, limit = 20 } = req.query;

            if (!page || !limit) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                    data: []
                });
            }

            let response = await TaskServices.getTaskListByAdminService(SetDataTypes.parseInt(page), SetDataTypes.parseInt(limit));


            if (!response) {
                return res.status(404).send({
                    message: "failed to get list of task",
                    status: "error",
                    data: []
                });
            }

            return res.status(200).send({
                data: response,
                status: "success",
                message: "task list get successfully"
            });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


    /* (================) ||  GET LIST TASK BY ID || (===============) */
    public static async getTaskListByUser(req: AuthRequest, res: Response) {
        try {
            let { page = 1, limit = 20 } = req.query;

            if (!page || !limit) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                    data: []
                });
            }

            let response = await TaskServices.getTaskListByUserService(req.user, SetDataTypes.parseInt(page), SetDataTypes.parseInt(limit));


            if (!response) {
                return res.status(404).send({
                    message: "failed to get list of task",
                    status: "error",
                    data: []
                });
            }

            return res.status(200).send({
                data: response,
                status: "success",
                message: "task list get successfully"
            });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


}

export default TaskController 
