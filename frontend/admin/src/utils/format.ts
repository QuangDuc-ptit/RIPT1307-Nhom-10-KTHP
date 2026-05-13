import dayjs from 'dayjs';

export const formatDate = (d?: string | Date | null, pattern = 'DD/MM/YYYY') =>
  d ? dayjs(d).format(pattern) : '';

export const formatDateTime = (d?: string | Date | null) =>
  d ? dayjs(d).format('DD/MM/YYYY HH:mm') : '';

export const truncate = (s: string, n = 100) =>
  s.length <= n ? s : `${s.slice(0, n)}...`;
