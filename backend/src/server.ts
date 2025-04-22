import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/routes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
