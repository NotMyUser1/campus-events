import express from "express";
import { Request, Response } from "express";

import Event from "../models/eventModel";

const router = express.Router();

router.get("/", async (req, res) => {
    const query: any = {};

    // Date-Filter
    if (req.query.from || req.query.to) {
        query.date = {};
        if (req.query.from) {
            const fromDate = new Date(req.query.from as string);
            if (isNaN(fromDate.getTime())) {
                return res.sendStatus(400);
            }
            query.date.$gte = fromDate;
        }
        if (req.query.to) {
            const toDate = new Date(req.query.to as string);
            if (isNaN(toDate.getTime())) {
                return res.sendStatus(400);
            }
            query.date.$lte = toDate;
        }
    }

    // Tags-Filter
    if (req.query.tags) {
        let tags: string[] = [];
        if (Array.isArray(req.query.tags)) {
            tags = req.query.tags as string[];
        } else if (typeof req.query.tags === "string") {
            tags = (req.query.tags as string).split(",");
        }
        if (tags.length > 0) {
            query.tags = { $all: tags };
        }
    }
    console.log(req.query);
    console.log(query);

    try {
        const events = await Event.find(query);
        res.json(events);
    } catch (error : any) {
        console.error('Failed to get all events...', error);
        res.sendStatus(500);
    }
});

router.get("/:id", getEvent, (req, res) => {
    res.send(res.locals.event);
});

router.post("/", async (req, res) => {
    const event = new Event({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
    });
    try {
        console.log('Creating new event...');
        const newEvent = await event.save();
        res.status(201).location(`/event/${newEvent._id}`).json(newEvent);
    } catch (error : any) {
        console.error('Failed to create event...', error);
        res.sendStatus(400);
    }
});

router.patch("/:id", getEvent, async (req, res) => {
    if (req.body.title != null) {
        res.locals.event.title = req.body.title;
    }
    if (req.body.description != null) {
        res.locals.event.description = req.body.description;
    }
    if (req.body.location != null) {
        res.locals.event.location = req.body.location;
    }
    if (req.body.date != null) {
        res.locals.event.date = req.body.date;
    }
    if (req.body.tags != null) {
        res.locals.event.tags = req.body.tags;
    }
    console.log("updating event..." + req.params.id);
    try {
        const updatedEvent = await res.locals.event.save();
        res.json(updatedEvent);
    } catch (error) {
        console.log('Failed to update event...' + req.params.id, error);
        return res.sendStatus(400);
    }
});

router.delete("/:id", getEvent, async (req, res) => {
    try {
        console.log("attempting to delete event..." + req.params.id);
        if (!res.locals.event) {
            console.log('Event not found...' + req.params.id);
            return res.sendStatus(404);
        }
        await res.locals.event.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        console.log('Failed to delete event...' + req.params.id, error);
        return res.sendStatus(500);
    }
});

async function getEvent(req : Request, res : Response, next: Function) {
    let event;
    if (!req.params.id || req.params.id.length !== 24) {
        console.log('Invalid event id...' + req.params.id);
        return res.sendStatus(400);
    }
    try {
        event = await Event.findById(req.params.id);
        if (event == null) {
            console.log('Event not found...' + req.params.id);
            return res.sendStatus(404);
        }
        res.locals.event = event;
        next();
    } catch (error) {
        console.log('Failed to find event...' + req.params.id, error)
        return res.sendStatus(500);
    }
}
export default router;