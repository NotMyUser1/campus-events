import express from "express";
import {Request, Response} from "express";
import Event from "../models/eventModel";
import fs from 'fs';

const router = express.Router();
const BASE_IMAGE_URL = process.env.BASE_IMAGE_URL || 'http://localhost:3000/img/';

router.get("/", getEvents, absolutizeImageUrls, (_req, res) => {
    res.send(res.locals.eventArray);
});

router.get("/:id", getEvent, absolutizeImageUrls, (_req, res) => {
    res.send(res.locals.event);
});

router.post("/", convertToEvent, minimizeImageUrlsForSingleEvent, async (_req, res) => {
    try {
        console.log('Creating new event...');
        const newEvent = await res.locals.event.save();
        res.status(201).location(`/event/${newEvent._id}`).json(newEvent);
    } catch (error: any) {
        console.error('Failed to create event...', error);
        res.sendStatus(400);
    }
});

router.patch("/:id", getEvent, patchEvent, minimizeImageUrlsForSingleEvent, async (req, res) => {
    console.log("updating event..." + req.params.id);
    try {
        const updatedEvent = await res.locals.event.save();
        res.json(updatedEvent);
    } catch (error) {
        console.log('Failed to update event...' + req.params.id, error);
        return res.sendStatus(400);
    }
});

router.delete("/:id", getEvent, deleteEvent, (_req, res) => {
    return res.sendStatus(204);
});

// ################################################

async function getEvent(req: Request, res: Response, next: Function) {
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

async function getEvents(req: Request, res: Response, next: Function) {
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
        } else {
            return res.sendStatus(400);
        }
        if (tags.length > 0) {
            query.tags = {$all: tags};
        }
    }
    console.log(req.query);
    console.log(query);

    try {
        res.locals.eventArray = await Event.find(query);
        next();
    } catch (error: any) {
        console.error('Failed to get all events...', error);
        res.sendStatus(500);
    }
}

async function deleteEvent(req: Request, res: Response, next: Function) {
    try {
        console.log("attempting to delete event..." + req.params.id);
        if (!res.locals.event) {
            console.log('Event not found...' + req.params.id);
            return res.sendStatus(404);
        }
        await res.locals.event.deleteOne();
        next();
    } catch (error) {
        console.log('Failed to delete event...' + req.params.id, error);
        return res.sendStatus(500);
    }
}

function absolutizeImageUrls(_req: Request, res: Response, next: Function) {
    absolutizeImageUrlsForEvent(res.locals.event);
    res.locals.eventArray?.forEach(absolutizeImageUrlsForEvent);
    next();
}

function absolutizeImageUrlsForEvent(event: any) {
    if (Array.isArray(event?.imageUrl)) {
        event.imageUrl = event.imageUrl.map((url: string) =>
            /^https?:\/\//i.test(url) ? url : BASE_IMAGE_URL + url
        );
    }
}

function convertToEvent(req: Request, res: Response, next: Function) {
    res.locals.event = new Event({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags
    });
    next();
}

async function minimizeImageUrlsForSingleEvent(_req: Request, res: Response, next: Function) {
    const event = res.locals.event;

    if (Array.isArray(event?.imageUrl)) {
        const regexp = /^(https?:\/\/)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[A-Za-z]{2,63}(?:[\/?#][\w\-.\/%?=&#]*)?$/;
        const allowedTypes = [
            'image/png', 'image/jpeg', 'image/gif', 'image/webp',
            'image/svg+xml', 'image/bmp', 'image/x-icon', 'image/vnd.microsoft.icon'
        ];

        const errors: string[] = [];
        event.imageUrl = await Promise.all(event.imageUrl.map(async (url: any) => {
            if (!isValidUrl(url, regexp)) {
                errors.push(`invalid image URL: ${url}`);
                return;
            }
            if (url.startsWith(BASE_IMAGE_URL)) {
                if (!fs.existsSync(`./img/${url.slice(BASE_IMAGE_URL.length)}`)) {
                    errors.push(`file does not exist: ${url}`);
                }
                return url.slice(BASE_IMAGE_URL.length);
            } else {
                try {
                    const image = await fetch(url);
                    if (!image.ok || !isAllowedContentType(image.headers.get('content-type'), allowedTypes)) {
                        errors.push(`invalid remote image: ${url}`);
                    }
                    return url;
                } catch (error) {
                    errors.push(`unable to fetch image: ${url}`);
                }
            }
        }));
        if (errors.length > 0) {
            console.log(errors.join('\n'));
            return res.sendStatus(400);
        }
    }

    next();
}

function isValidUrl(url: any, regexp: RegExp): boolean {
    console.log(!url.startsWith(BASE_IMAGE_URL));
    return typeof url === 'string'
        && (url.startsWith(BASE_IMAGE_URL) || regexp.test(url))
        && !url.includes('../');
}

function isAllowedContentType(contentType: string | null, allowedTypes: string[]): boolean {
    return contentType != null && allowedTypes.includes(contentType);
}

function patchEvent(req: Request, res: Response, next: Function) {
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
    if (req.body.imageUrl != null) {
        res.locals.events.imageUrl = req.body.imageUrl;
    }
    if (req.body.tags != null) {
        res.locals.event.tags = req.body.tags;
    }
    next();
}
export default router;