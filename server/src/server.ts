import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();
const APP_PORT = 3333;

app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());
app.listen(APP_PORT, () => {
    console.log(`the magic happens on ${APP_PORT}`)
});