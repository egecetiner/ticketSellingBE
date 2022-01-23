import * as express from 'express';
import * as functions from 'firebase-functions';
import {
  addEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from './eventController';
import {form, iyzico} from './paymentController';
import {
  deleteTicket,
  getAllTickets,
  getTicket,
  updateTicket,
} from './ticketController';
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './userController';

const app = express();

app.get('/users/:userId', getUser);
app.post('/users/:userId', addUser);
app.get('/users/', getAllUsers);
app.put('/users/:userId', updateUser);
app.delete('/users/:userId', deleteUser);

app.post('/events/', addEvent);
app.get('/events/:eventId', getEvent);
app.get('/events/', getAllEvents);
app.put('/events/:eventId', updateEvent);
app.delete('/events/:eventId', deleteEvent);

app.get('/tickets/:ticketId', getTicket);
app.get('/tickets/', getAllTickets);
app.put('/tickets/:ticketId', updateTicket);
app.delete('/tickets/:ticketId', deleteTicket);

app.post('/payment/form/:userId/:eventId', form);
app.post('/payment/make-payment/', iyzico);

exports.app = functions.region('europe-west1').https.onRequest(app);
