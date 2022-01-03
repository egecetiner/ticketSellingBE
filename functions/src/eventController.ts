import { Response } from "express";
import { bucket, db } from './config/firebase';



type EventType = {
  title : string,
  description: string,
  date: any,
  mekan: string,
  city: string,
  program: any
  biletler: any,
  personals: any,
  notlar: string
  eventImage: string
}
type ImageType = {
  uploadUri : string,
  fileName: string
}
type Req ={
  body: ImageType
}

type Request = {
  body: EventType,
  params: { eventId: string }
}

const addEvent= async (req: Request, res: Response) => {

  const { body: { title, description, date, mekan, city, program, biletler, personals, notlar, eventImage }} = req
  try {
    const event = db.collection('events').doc()
    const eventObject = {
      id: event.id,
      title : title,
      description: description,
      date: date,
      mekan: mekan,
      city:city,
      program: program,
      biletler: biletler,
      notlar:notlar,
      personals: personals,
      eventImage: eventImage
    }

    await event.set(eventObject)
  
    res.status(200).send({
      status: 'Success',
      message: `Event added successfully`,
      data: eventObject

    })
  } catch(error) {
      res.status(500).json(error.message)
  }
}


const getAllEvents = async (req: Request, res: Response) => {
        try {
          const allEvents: EventType[] = []
          const querySnapshot = await db.collection('events').get()
          querySnapshot.forEach((doc: any) => allEvents.push(doc.data()))
          return res.status(200).json(allEvents)
        } catch(error) { return res.status(500).json(error.message) }
      }
      
      const getEvent = async (req: Request, res: Response) => {
        try {
          const {  params: { eventId } } = req
          const event = db.collection('events').doc(eventId)
          const currentData = (await event.get()).data() || {}
        
          return res.status(200).json(currentData)
        } catch(error) { return res.status(500).json(error.message) }
      }
      
      const updateEvent = async (req: Request, res: Response) => {
        const { body: { title, description, date, mekan, city, notlar, program, biletler, personals, eventImage }, params: { eventId } } = req
      
        try {
          const event = db.collection('events').doc(eventId)
          const currentData = (await event.get()).data() || {}
      
          const eventObject = {
                id : currentData.id ,
                title: title || currentData.title ,
                description: description|| currentData.description,
                date: date  ||currentData.date,
                mekan : mekan || currentData.mekan,
                city : city || currentData.city,
                notlar : notlar || currentData.notlar,
                program : program ||currentData.program,
                biletler: biletler || currentData.biletler,
                personals: personals || currentData.personals,
                eventImage: eventImage || currentData.eventImage
          }
      
          await event.set(eventObject).catch(error => {
            return res.status(400).json({
              status: 'error',
              message: error.message
            })
          })
      
          return res.status(200).json({
            status: 'success',
            message: 'Event updated successfully',
            data: eventObject
          })
        }
        catch(error) { return res.status(500).json(error.message) }
      }
      
      const deleteEvent = async (req: Request, res: Response) => {
        const { eventId } = req.params
      
        try {
          const event = db.collection('events').doc(eventId)
      
          await event.delete().catch(error => {
            return res.status(400).json({
              status: 'error',
              message: error.message
            })
          })
      
          return res.status(200).json({
            status: 'success',
            message: 'Event deleted successfully',
          })
        }
        catch(error) { return res.status(500).json(error.message) }

      }


   

      const imageUpload= async (req: Req, res: Response) => {

        const { body: { uploadUri, fileName }} = req
        const imageBucket = "eventImages/";
        const destination = `${imageBucket}${fileName}`;

     try {
       // Uploads a local file to the bucket
      await bucket.upload(uploadUri, {
        destination: destination,
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
      },
      });
      return res.status(200).json({
        status: 'success',
        message:`${fileName} uploaded to /${imageBucket}/${fileName}.`
      })
    
     }
      catch (e) {
        throw new Error("uploadLocalFileToStorage failed: " + e);
    }
    }


    


export { addEvent, getAllEvents, getEvent, deleteEvent, updateEvent, imageUpload };

