/* ====== TypeScript with Express ====== */
import express from 'express';
import dotenv from 'dotenv';
import upload from './middlewares/upload.middlware';
import { Request, Response } from 'express';
import { AuthRoutes } from './routes/v1/auth/auth.routes';
import cors from 'cors';
import './module-alias'
import path from 'path';
import setupSocketServer from './socketIo/socketIo';
import bodyParser from 'body-parser';


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

/* ====== Not Found Routes ====== */
app.get("*", (req: Request, res: Response) => {
  return res.status(505).json({ message: "Bad Request" });
});



/* ====== Server Start ====== */
httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})