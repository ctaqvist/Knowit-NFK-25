import express from 'express';
import imageRouter from './routers/imageRouter.js';
import userRouter from './routers/userRouter.js';
import roverRouter from './routers/roverRouter.js';

const expressApp = express();

expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());

expressApp.use(userRouter);
expressApp.use("/images", imageRouter);
expressApp.use(roverRouter);

expressApp.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World! This is the Terrax9 API! :)" });
});

export default expressApp