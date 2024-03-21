import { ticketModel } from "../models/ticket.model.js";
class TicketDao {
  async createTicket(ticketData) {
    try {
      await ticketModel.create(ticketData);
    } catch (error) {
      throw error;
    }
  }

  async getAllTickets() {
    try {
      const tickets = await ticketModel.find();
      return tickets;
    } catch (error) {
      throw new Error('Error getting tickets: ' + error.message);
    }
  }

  async getTicketById(ticketId) {
    try {
      return await ticketModel.findById(ticketId);
    } catch (error) {
      throw new Error('Error getting ticket: ' + error.message);
    }
  }

}

export default TicketDao;
