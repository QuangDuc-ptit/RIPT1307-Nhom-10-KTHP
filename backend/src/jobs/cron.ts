import cron from 'node-cron';
import { prisma } from '@/config/db';

export const startCronJobs = () => {
  // Chạy mỗi 1 phút
  cron.schedule('* * * * *', async () => {
    try {
      // Tìm các ghế đang ở trạng thái RESERVED nhưng đã quá hạn expiresAt
      const result = await prisma.showtimeSeat.updateMany({
        where: {
          status: 'RESERVED',
          expiresAt: { lt: new Date() }
        },
        data: {
          status: 'AVAILABLE',
          userId: null,
          expiresAt: null
        }
      });

      if (result.count > 0) {
        console.log(`[Cron] Đã tự động nhả ${result.count} ghế hết hạn giữ chỗ.`);
      }
    } catch (error) {
      console.error('[Cron] Lỗi khi nhả ghế tự động:', error);
    }
  });

  console.log('[Cron] Đã khởi động các tiến trình chạy ngầm.');
};
