import cron from "node-cron";
import TaskRepository from "~/modules/task/task.repository";

const taskReminderJob = cron.schedule("0 8 * * *", async () => {
    try {
        console.log("Running task reminder cron job...");


        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let incompleteTasks = await TaskRepository.getTaskListByUserService(yesterday, false);

        if (incompleteTasks.length > 0) {
            incompleteTasks.forEach((task: any) => {
                console.log(`Reminder: Task "${task.title}" is still incomplete.`);
            });
        } else {
            console.log("No pending tasks to remind.");
        }
    } catch (error) {
        console.error("Error running task reminder cron job:", error);
    }
});

export default taskReminderJob;
