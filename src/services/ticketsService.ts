import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// Get all tickets
export const getTickets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Get a ticket by ID
export const getTicketById = async (ticketId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

// Get all tickets for a specific user
export const getUserTickets = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tickets for user with ID ${userId}:`, error);
    throw error;
  }
};

// Create a new ticket
export const createTicket = async (ticketData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-ticket`, ticketData);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// Update a ticket
export const updateTicket = async (ticketData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-ticket`, ticketData);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

// Delete a ticket
export const deleteTicket = async (ticketId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

// Assign a ticket to an admin
export const assignTicket = async (ticketId: string, adminId: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/assign-ticket`, {
      ticket_id: ticketId,
      admin_id: adminId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error assigning ticket with ID ${ticketId} to admin with ID ${adminId}:`, error);
    throw error;
  }
};

// Close a ticket
export const closeTicket = async (ticketId: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/close-ticket`, {
      ticket_id: ticketId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error closing ticket with ID ${ticketId}:`, error);
    throw error;
  }
};