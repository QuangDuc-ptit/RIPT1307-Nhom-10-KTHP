import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';

export const dashboardController = {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const data = await dashboardService.getStats(days);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
