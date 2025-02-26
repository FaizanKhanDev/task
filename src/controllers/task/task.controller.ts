import { Request, Response } from "express";
import { errorHandler } from "../../middlewares/error.middleware";
import { AuthRequest } from "../../interfaces";

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
            

            if () {
                return res.status(404).send({
                    message: "User not found",
                    status: "error",
                    data: []

                });
            }

            return res.status(200).json({
                data: [],
                status: "success",
                message: "Login successfully"
            });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


}

export default TaskController 
