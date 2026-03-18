import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import periodsRoutes from './routes/periods';
import profileRoutes from './routes/profile';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/api/periods', periodsRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`Sakhi API running on port ${PORT}`);
});
