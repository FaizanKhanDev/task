/* ====== TypeScript with Express ====== */
import express from 'express';
import dotenv from 'dotenv';
import upload from './middlewares/upload.middlware';
import { Request, Response } from 'express';
import { AuthRoutes } from './routes/v1/authRoutes';
import { UserRoutes } from './routes/v1/userRoutes';
import { ProfileTypeRoutes } from './routes/v1/profileTypesRoutes';
import { ListingsRoutes } from './routes/v1/listingsRoutes';
import { ChatRoutes } from './routes/v1/chatRoutes';
import cors from 'cors';
import './module-alias'
import { AdvertisementRoutes } from './routes/v1/advertisementRoutes';
import { CategoryRoutes } from './routes/v1/categoriesRoutes';
import { DashboardRoutes } from './routes/v1/dashboardRoutes';
import { meetingRoutes } from './routes/v1/meetingRoutes';
import { FileRoutes } from './routes/v1/fileRoutes';
import path from 'path';
import setupSocketServer from './socketIo/socketIo';
import bodyParser from 'body-parser';
import { StoresRoutes } from './routes/v1/stores';
import { ConnectionRoutes } from './routes/v1/coonectionRoutes';


/* ====== Config ====== */
dotenv.config();

/* ====== PORT ====== */
const PORT = process.env.PORT || 8000;

/* ==== Server Setup ==== */
const app = express();

const { httpServer, io } = setupSocketServer(app);

/* ====== Middlewares ====== */
app.use(express.json());

/* ================= CORS =============== */
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors());


app.use(express.urlencoded({ extended: true }));


/*  ================= Increase payload size limit =========== */
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/* =================  Setup Live/Local Url of uploads =========== */
/* ================ Serve static files from the 'uploads' directory ================= */
app.use('/api/v1/bucket/', express.static(path.join(__dirname, 'public', 'uploads')));

/* ========= Confirguring Multer ========= */
app.use(upload.fields([
  {
    name: 'files', maxCount: 100
  }
]));






/* ====== Routes ====== */
app.get('/', (req, res) => {
  console.log("Hello, TypeScript with Express!");
  res.send({
    message: 'Hello, TypeScript with Express!',
    status: "success"
  });
});

app.get('/api/v1', (req, res) => {
  res.send({
    message: 'Hello, TypeScript with Express!',
  });
});

/* ================= Routes ================= */
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/subscriptions', ProfileTypeRoutes);
app.use('/api/v1/advertisements', AdvertisementRoutes);
app.use('/api/v1/listings', ListingsRoutes);
app.use('/api/v1/chats', ChatRoutes);
app.use('/api/v1/categories', CategoryRoutes);
app.use('/api/v1/dashboard', DashboardRoutes);
app.use('/api/v1/meetings', meetingRoutes);
app.use('/api/v1/bucket', FileRoutes)
app.use('/api/v1/stores', StoresRoutes)
app.use('/api/v1/connection', ConnectionRoutes)

/* ====== Not Found Routes ====== */
app.get("*", (req: Request, res: Response) => {
  return res.status(505).json({ message: "Bad Request" });
});



/* ====== Server Start ====== */
httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})