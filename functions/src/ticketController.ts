import {Response} from 'express';
import {db} from './config/firebase';

type ticketType = {
  id: string;
  eventId: string;
  userId: string;
  read: boolean;
};

type Request = {
  query: any;
  body: ticketType;
  params: {userId: string; ticketId: string};
};

// buraya etkinlikte görevli personel de çekilir.
const getAllTickets = async (req: Request, res: Response) => {
  try {
    let filterUser = req.query.userId;
    let filterEvent = req.query.eventId;
    const allTickets: ticketType[] = [];
    if (filterEvent && filterUser) {
      const querySnapshot = await db
        .collection('tickets')
        .where('eventId', '==', filterEvent)
        .where('userId', '==', filterUser)
        .get();
      querySnapshot.forEach((doc: any) => allTickets.push(doc.data()));
      return res.status(200).json(allTickets);
    } else if (filterEvent) {
      const querySnapshot = await db
        .collection('tickets')
        .where('eventId', '==', filterEvent)
        .get();
      querySnapshot.forEach((doc: any) => allTickets.push(doc.data()));
      return res.status(200).json(allTickets);
    } else if (filterUser) {
      const querySnapshot = await db
        .collection('tickets')
        .where('userId', '==', filterUser)
        .get();
      querySnapshot.forEach((doc: any) => allTickets.push(doc.data()));
      return res.status(200).json(allTickets);
    } else {
      const querySnapshot = await db.collection('tickets').get();
      querySnapshot.forEach((doc: any) => allTickets.push(doc.data()));
      return res.status(200).json(allTickets);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getTicket = async (req: Request, res: Response) => {
  try {
    const {
      params: {ticketId},
    } = req;

    const ticket = db.collection('tickets').doc(ticketId);
    const currentData = (await ticket.get()).data() || {};

    return res.status(200).json(currentData);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateTicket = async (req: Request, res: Response) => {
  const {
    body: {read},
    params: {ticketId},
  } = req;

  try {
    const ticket = db.collection('tickets').doc(ticketId);
    const currentData = (await ticket.get()).data() || {};

    const ticketObject = {
      id: currentData.id,
      eventId: currentData.eventId,
      userId: currentData.userId,
      ticketName: currentData.ticketName,
      read: read,
    };

    await ticket.set(ticketObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: ticketObject,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteTicket = async (req: Request, res: Response) => {
  const {ticketId} = req.params;

  try {
    const ticket = db.collection('tickets').doc(ticketId);

    await ticket.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export {getAllTickets, updateTicket, getTicket, deleteTicket};
