export const orderStatuses = [
  'Processing',
  'Paid',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
] as const;
export const orderStatusTransitions: Record<
  (typeof orderStatuses)[number],
  (typeof orderStatuses)[number][]
> = {
  Processing: ['Paid', 'Cancelled'],
  Paid: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered', 'Cancelled'],
  Delivered: ['Refunded'],
  Cancelled: ['Refunded'],
  Refunded: [],
};
