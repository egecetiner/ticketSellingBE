"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = exports.deleteEvent = exports.getEvent = exports.getAllEvents = exports.addEvent = void 0;
const firebase_1 = require("./config/firebase");
const addEvent = async (req, res) => {
    const { body: { title, description, date, mekan, city, program, biletler, personals, notlar, eventImage, }, } = req;
    try {
        const event = firebase_1.db.collection('events').doc();
        const eventObject = {
            id: event.id,
            title: title,
            description: description,
            date: date,
            mekan: mekan,
            city: city,
            program: program,
            biletler: biletler,
            notlar: notlar,
            personals: personals,
            eventImage: eventImage,
        };
        await event.set(eventObject);
        res.status(200).send({
            status: 'Success',
            message: `Event added successfully`,
            data: eventObject,
        });
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.addEvent = addEvent;
const getAllEvents = async (req, res) => {
    try {
        let filterId = req.query.id;
        let filterTitle = req.query.title;
        const allEvents = [];
        if (filterId) {
            const querySnapshot = await firebase_1.db
                .collection('events')
                .where('id', '==', filterId)
                .get();
            querySnapshot.forEach((doc) => allEvents.push(doc.data()));
            return res.status(200).json(allEvents);
        }
        else if (filterTitle) {
            const querySnapshot = await firebase_1.db
                .collection('events')
                .where('title', '==', filterTitle)
                .get();
            querySnapshot.forEach((doc) => allEvents.push(doc.data()));
            return res.status(200).json(allEvents);
        }
        else {
            const querySnapshot = await firebase_1.db.collection('events').get();
            querySnapshot.forEach((doc) => allEvents.push(doc.data()));
            return res.status(200).json(allEvents);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getAllEvents = getAllEvents;
const getEvent = async (req, res) => {
    try {
        const { params: { eventId }, } = req;
        const event = await firebase_1.db.collection('events').doc(eventId);
        const currentData = (await event.get()).data() || {};
        return res.status(200).json(currentData);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getEvent = getEvent;
const updateEvent = async (req, res) => {
    const { body: { title, description, date, mekan, city, notlar, program, biletler, personals, eventImage, }, params: { eventId }, } = req;
    try {
        const event = firebase_1.db.collection('events').doc(eventId);
        const currentData = (await event.get()).data() || {};
        const eventObject = {
            id: currentData.id,
            title: title || currentData.title,
            description: description || currentData.description,
            date: date || currentData.date,
            mekan: mekan || currentData.mekan,
            city: city || currentData.city,
            notlar: notlar || currentData.notlar,
            program: program || currentData.program,
            biletler: biletler || currentData.biletler,
            personals: personals || currentData.personals,
            eventImage: eventImage || currentData.eventImage,
        };
        await event.set(eventObject).catch((error) => {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        });
        return res.status(200).json({
            status: 'success',
            message: 'Event updated successfully',
            data: eventObject,
        });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = firebase_1.db.collection('events').doc(eventId);
        await event.delete().catch((error) => {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        });
        return res.status(200).json({
            status: 'success',
            message: 'Event deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=eventController.js.map