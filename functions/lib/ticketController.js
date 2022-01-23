"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.getTicket = exports.updateTicket = exports.getAllTickets = void 0;
const firebase_1 = require("./config/firebase");
// buraya etkinlikte görevli personel de çekilir.
const getAllTickets = async (req, res) => {
    try {
        let filterUser = req.query.userId;
        let filterEvent = req.query.eventId;
        const allTickets = [];
        if (filterEvent && filterUser) {
            const querySnapshot = await firebase_1.db
                .collection('tickets')
                .where('eventId', '==', filterEvent)
                .where('userId', '==', filterUser)
                .get();
            querySnapshot.forEach((doc) => allTickets.push(doc.data()));
            return res.status(200).json(allTickets);
        }
        else if (filterEvent) {
            const querySnapshot = await firebase_1.db
                .collection('tickets')
                .where('eventId', '==', filterEvent)
                .get();
            querySnapshot.forEach((doc) => allTickets.push(doc.data()));
            return res.status(200).json(allTickets);
        }
        else if (filterUser) {
            const querySnapshot = await firebase_1.db
                .collection('tickets')
                .where('userId', '==', filterUser)
                .get();
            querySnapshot.forEach((doc) => allTickets.push(doc.data()));
            return res.status(200).json(allTickets);
        }
        else {
            const querySnapshot = await firebase_1.db.collection('tickets').get();
            querySnapshot.forEach((doc) => allTickets.push(doc.data()));
            return res.status(200).json(allTickets);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getAllTickets = getAllTickets;
const getTicket = async (req, res) => {
    try {
        const { params: { ticketId }, } = req;
        const ticket = firebase_1.db.collection('tickets').doc(ticketId);
        const currentData = (await ticket.get()).data() || {};
        return res.status(200).json(currentData);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getTicket = getTicket;
const updateTicket = async (req, res) => {
    const { body: { read }, params: { ticketId }, } = req;
    try {
        const ticket = firebase_1.db.collection('tickets').doc(ticketId);
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
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.updateTicket = updateTicket;
const deleteTicket = async (req, res) => {
    const { ticketId } = req.params;
    try {
        const ticket = firebase_1.db.collection('tickets').doc(ticketId);
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
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.deleteTicket = deleteTicket;
//# sourceMappingURL=ticketController.js.map