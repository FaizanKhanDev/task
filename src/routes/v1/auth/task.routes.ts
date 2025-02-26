import express, { Router, Request, Response } from 'express';
import TaskController from '../../../controllers/task/task.controller';
const router: Router = express.Router();

import { authentification } from '../../../middlewares/auth.authentification';

/* ====== PROTECT ALL ROUTES =====*/
router.use(authentification);



/* ====== CREATE NEW TASK ====== */
router.post('/create-new-task', TaskController.createNewTask);
router.all('/create-new-task', (req, res) => {
    if (req.method != "POST") {
        return res.status(405).send({
            status: "success",
            message: "Method Not Allowed",
            data: [],
        })
    }
});


/* ====== UPDATE  TASK ====== */
router.put('/update-task', TaskController.updateTask);
router.all('/update-task', (req, res) => {
    if (req.method != "PUT") {
        return res.status(405).send({
            status: "success",
            message: "Method Not Allowed",
            data: [],
        })
    }
});

/* ====== DELETE  TASK ====== */
router.delete('/delete-task/:id', TaskController.deleteTask);
router.all('/delete-task/:id', (req, res) => {
    if (req.method != "DELETE") {
        return res.status(405).send({
            status: "success",
            message: "Method Not Allowed",
            data: [],
        })
    }
});


/* ====== GET TASK LIST BY ADMIN  ====== */
router.get('/get-task-list-by-admin', TaskController.getTaskListByAdmin);
router.all('/get-task-list-by-admin', (req, res) => {
    if (req.method != "GET") {
        return res.status(405).send({
            status: "success",
            message: "Method Not Allowed",
            data: [],
        })
    }
});



/* (======) ||  GET TASK LIST BY USER  || (======) */
router.get('/get-task-list-by-user', TaskController.getTaskListByUser);
router.all('/get-task-list-by-user', (req, res) => {
    if (req.method != "GET") {
        return res.status(405).send({
            status: "success",
            message: "Method Not Allowed",
            data: [],
        })
    }
});





export { router as TaskRoutes };
