
import { apiClient } from "./apiClient";
import { delay } from "./utils/apiUtils";

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
  seen: boolean;
  attachments?: string[];
}

interface SendMessageOptions {
  ticketId: string;
  content: string;
  attachments?: File[];
  sender?: 'user' | 'admin';
}

// Message Management
export const fetchMessages = async ({ ticketId }: { ticketId: string }): Promise<Message[]> => {
  try {
    await delay(800);
    // In a real app, this would call the API
    return [
      {
        id: "1",
        ticketId,
        content: "Hello, I'm having an issue with my account",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        seen: true
      },
      {
        id: "2",
        ticketId,
        content: "Please describe the issue in more detail",
        sender: "admin",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        seen: true
      },
      {
        id: "3",
        ticketId,
        content: "I can't access my dashboard after the recent update",
        sender: "user",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        seen: false
      }
    ];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async ({ ticketId, content, attachments = [], sender = "user" }: SendMessageOptions): Promise<Message> => {
  await delay(1000);
  
  let fileUrls: string[] = [];
  
  // If attachments are provided, simulate uploading them
  if (attachments && attachments.length > 0) {
    // In a real app, this would upload the files to a server
    fileUrls = attachments.map((file, index) => 
      `https://example.com/uploads/${ticketId}/${Date.now()}-${index}-${file.name}`
    );
  }
  
  // In a real app, this would call the API
  const newMessage: Message = {
    id: Math.random().toString(36).substring(2, 15),
    ticketId,
    content,
    sender,
    timestamp: new Date().toISOString(),
    seen: false,
    attachments: fileUrls
  };
  
  return newMessage;
};

export const markAsSeen = async (messageId: string): Promise<void> => {
  await delay(500);
  // In a real app, this would call the API
  console.log(`Marking message ${messageId} as seen`);
};

export const messageService = {
  fetchMessages,
  sendMessage,
  markAsSeen
};
