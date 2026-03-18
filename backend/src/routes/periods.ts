import { Router, Response } from 'express';
import { query, queryOne } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const logs = await query(
    'SELECT * FROM period_logs WHERE user_id = $1 ORDER BY start_date DESC',
    [req.userId]
  );
  res.json(logs);
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { start_date, end_date, notes } = req.body;

  if (!start_date) {
    res.status(400).json({ error: 'start_date is required' });
    return;
  }

  const existing = await queryOne(
    'SELECT id FROM period_logs WHERE user_id = $1 AND start_date = $2',
    [req.userId, start_date]
  );
  if (existing) {
    res.status(409).json({ error: 'A period log with this start date already exists' });
    return;
  }

  const [log] = await query(
    `INSERT INTO period_logs (user_id, start_date, end_date, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.userId, start_date, end_date ?? null, notes ?? null]
  );
  res.status(201).json(log);
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { start_date, end_date, notes } = req.body;

  const log = await queryOne(
    'SELECT id FROM period_logs WHERE id = $1 AND user_id = $2',
    [id, req.userId]
  );
  if (!log) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const [updated] = await query(
    `UPDATE period_logs
     SET start_date = COALESCE($1, start_date),
         end_date   = $2,
         notes      = $3
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [start_date ?? null, end_date ?? null, notes ?? null, id, req.userId]
  );
  res.json(updated);
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM period_logs WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, req.userId]
  );
  if (result.length === 0) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ success: true });
});

export default router;
