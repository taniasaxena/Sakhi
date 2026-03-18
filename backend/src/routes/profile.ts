import { Router, Response } from 'express';
import { queryOne, query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const profile = await queryOne('SELECT * FROM profiles WHERE id = $1', [req.userId]);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }
  res.json(profile);
});

router.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { cycle_length, period_length } = req.body;

  const [updated] = await query(
    `UPDATE profiles
     SET cycle_length  = COALESCE($1, cycle_length),
         period_length = COALESCE($2, period_length)
     WHERE id = $3
     RETURNING *`,
    [cycle_length ?? null, period_length ?? null, req.userId]
  );
  res.json(updated);
});

export default router;
