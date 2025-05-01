
import { delay } from './utils/apiUtils';

// Example metrics data for demonstration
const mockMetricsData = {
  metrics: [
    { name: 'sales', value: 1200, date: '2023-01-01T00:00:00.000Z' },
    { name: 'sales', value: 1500, date: '2023-02-01T00:00:00.000Z' },
    { name: 'sales', value: 1800, date: '2023-03-01T00:00:00.000Z' },
    { name: 'sales', value: 2200, date: '2023-04-01T00:00:00.000Z' },
    { name: 'sales', value: 2500, date: '2023-05-01T00:00:00.000Z' },
    { name: 'sales', value: 2800, date: '2023-06-01T00:00:00.000Z' },
    { name: 'users', value: 100, date: '2023-01-01T00:00:00.000Z' },
    { name: 'users', value: 150, date: '2023-02-01T00:00:00.000Z' },
    { name: 'users', value: 200, date: '2023-03-01T00:00:00.000Z' },
    { name: 'users', value: 250, date: '2023-04-01T00:00:00.000Z' },
    { name: 'users', value: 300, date: '2023-05-01T00:00:00.000Z' },
    { name: 'users', value: 350, date: '2023-06-01T00:00:00.000Z' },
  ]
};

// Example orders data for demonstration
const mockOrdersData = [
  { 
    order_id: '1', 
    customer_id: 'user1', 
    amount: 99.99, 
    quantity: 1,
    status: 'completed', 
    payment_status: 'paid',
    created_at: '2023-06-01T14:30:00.000Z' 
  },
  { 
    order_id: '2', 
    customer_id: 'user2', 
    amount: 149.99, 
    quantity: 1,
    status: 'completed', 
    payment_status: 'paid',
    created_at: '2023-06-02T10:15:00.000Z' 
  },
  { 
    order_id: '3', 
    customer_id: 'user3', 
    amount: 199.99, 
    quantity: 2,
    status: 'processing', 
    payment_status: 'pending',
    created_at: '2023-06-03T16:45:00.000Z' 
  },
  { 
    order_id: '4', 
    customer_id: 'user4', 
    amount: 299.99, 
    quantity: 1,
    status: 'processing', 
    payment_status: 'pending',
    created_at: '2023-06-04T09:20:00.000Z' 
  },
  { 
    order_id: '5', 
    customer_id: 'user5', 
    amount: 399.99, 
    quantity: 3,
    status: 'completed', 
    payment_status: 'paid',
    created_at: '2023-06-05T11:10:00.000Z' 
  }
];

// Get analytics metrics
export const getMetrics = async () => {
  await delay(800);
  return mockMetricsData;
};

// Get orders for analytics dashboard
export const getOrders = async () => {
  await delay(800);
  return mockOrdersData;
};

export const analyticsService = {
  getMetrics,
  getOrders,
};
