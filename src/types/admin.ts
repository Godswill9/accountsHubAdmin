
// Common types used across admin services
export interface Credentials {
  email: string;
  password: string;
}

export interface AdminData {
  id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  featured?: boolean;
  imageUrl?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status?: string;
  walletBalance?: number;
}

export interface OrderData {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface MetricData {
  id: string;
  name: string;
  value: number;
  date: string;
}

export interface TicketData {
  id: string;
  userId: string;
  subject: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface MessageData {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  content: string;
  attachments?: string[];
  seenByAdmin: boolean;
  createdAt: string;
}
