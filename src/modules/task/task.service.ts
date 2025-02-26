



class TaskServices {


    /* (================) ||  CREATE NEW TASK || (===============) */
    public static async createNewTask(user: any, title: string, description: string) {
        try {


        } catch (error: any) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }

}