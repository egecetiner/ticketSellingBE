import * as express from "express";
import * as functions from "firebase-functions";
import { addEvent, deleteEvent, getAllEvents, getEvent, imageUpload, updateEvent } from "./eventController";
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from './userController';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const app = express()

app.get('/users/:userId', getUser)
app.post('/users/:userId', addUser)
app.get('/users/', getAllUsers)
app.put('/users/:userId', updateUser)
app.delete('/users/:userId', deleteUser)


app.post('/events/',addEvent )
app.post('/events/addImage',imageUpload)
app.get('/events/:eventId', getEvent)
app.get('/events/', getAllEvents)
app.put('/events/:eventId', updateEvent)
app.delete('/events/:eventId', deleteEvent)

exports.app = functions.region("europe-west1").https.onRequest(app)

