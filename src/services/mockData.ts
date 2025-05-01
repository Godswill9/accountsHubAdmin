
import { AdminData, ProductData, UserData, OrderData, MetricData, TicketData, MessageData } from "../types/admin";

// Mock data
export const mockAdmins: AdminData[] = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin", createdAt: "2023-01-01" },
  { id: "2", name: "Editor User", email: "editor@example.com", role: "editor", createdAt: "2023-02-15" }
];

export const mockProducts: ProductData[] = [
  { id: "1", name: "Premium Digital Package", description: "Full suite of digital templates", price: 99.99, featured: true, imageUrl: "/placeholder.svg" },
  { id: "2", name: "Business Strategy Guide", description: "Complete business strategy toolkit", price: 49.99, featured: true, imageUrl: "/placeholder.svg" },
  { id: "3", name: "Social Media Templates", description: "20 premium social media templates", price: 29.99, featured: false, imageUrl: "/placeholder.svg" }
];

export const mockUsers: UserData[] = [
  { id: "1", name: "John Doe", email: "john@example.com", createdAt: "2023-01-10", status: "active", walletBalance: 250.00 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", createdAt: "2023-02-05", status: "active", walletBalance: 175.50 },
  { id: "3", name: "Robert Johnson", email: "robert@example.com", createdAt: "2023-03-15", status: "banned", walletBalance: 0 }
];

export const mockOrders: OrderData[] = [
  { id: "1", userId: "1", products: [{ productId: "1", quantity: 1, price: 99.99 }], totalAmount: 99.99, status: "completed", createdAt: "2023-03-10" },
  { id: "2", userId: "2", products: [{ productId: "2", quantity: 1, price: 49.99 }], totalAmount: 49.99, status: "processing", createdAt: "2023-03-18" },
  { id: "3", userId: "3", products: [{ productId: "3", quantity: 2, price: 29.99 }], totalAmount: 59.98, status: "completed", createdAt: "2023-03-20" }
];

export const mockMetrics: MetricData[] = [
  { id: "1", name: "sales", value: 15000, date: "2023-03-01" },
  { id: "2", name: "users", value: 120, date: "2023-03-01" },
  { id: "3", name: "orders", value: 45, date: "2023-03-01" },
  { id: "4", name: "sales", value: 18000, date: "2023-04-01" },
  { id: "5", name: "users", value: 150, date: "2023-04-01" },
  { id: "6", name: "orders", value: 60, date: "2023-04-01" }
];

export const mockTickets: TicketData[] = [
  { id: "1", userId: "1", subject: "Payment issue", status: "open", assignedTo: "1", createdAt: "2023-04-01", lastUpdated: "2023-04-05" },
  { id: "2", userId: "2", subject: "Product not delivered", status: "closed", createdAt: "2023-04-10", lastUpdated: "2023-04-15" },
  { id: "3", userId: "3", subject: "Refund request", status: "pending", createdAt: "2023-04-20", lastUpdated: "2023-04-20" }
];

export const mockMessages: MessageData[] = [
  { id: "1", ticketId: "1", senderId: "1", senderType: "user", content: "I'm having issues with my payment", seenByAdmin: true, createdAt: "2023-04-01" },
  { id: "2", ticketId: "1", senderId: "1", senderType: "admin", content: "I'll look into this for you", seenByAdmin: true, createdAt: "2023-04-02" },
  { id: "3", ticketId: "2", senderId: "2", senderType: "user", content: "I haven't received my product yet", seenByAdmin: false, createdAt: "2023-04-10" }
];
