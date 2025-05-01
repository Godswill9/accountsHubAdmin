import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// Send a message as admin
export const sendMessageAsAdmin = async (messageData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-message-admin`, messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message as admin:", error);
    throw error;
  }
};

// Fetch all messages
export const getAllMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetch-all-messages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all messages:", error);
    throw error;
  }
};

// Fetch messages by ticket ID
export const getMessagesByTicketId = async (ticketId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch-messages`, { ticket_id: ticketId });
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for ticket ID ${ticketId}:`, error);
    throw error;
  }
};

// Mark a message as seen by admin
export const markMessageSeenByAdmin = async (messageId: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/edit-message-seen-by-admin`, {
      message_id: messageId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error marking message with ID ${messageId} as seen by admin:`, error);
    throw error;
  }
};

// Upload message files
export const uploadMessageFiles = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading message files:", error);
    throw error;
  }
};

// Send email notification for a new message
export const sendEmailNotification = async (emailData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-message-mail`, emailData);
    return response.data;
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
};

// Send email notification to admin for a new message
export const sendEmailNotificationToAdmin = async (emailData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-message-mail-to-admin`, emailData);
    return response.data;
  } catch (error) {
    console.error("Error sending email notification to admin:", error);
    throw error;
  }
};

// Get an image by ID
export const getImageById = async (imageId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-image/${imageId}`, {
      responseType: "blob", // To handle image data
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching image with ID ${imageId}:`, error);
    throw error;
  }
};