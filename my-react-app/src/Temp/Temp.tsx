import './Temp.css'
import type {EventModel} from "../models/EventModel.ts";
import {useEffect, useState} from "react";
import EventWidget from "./EventWidget/EventWidget.tsx";

const fetchAPI = async () => {
    try {
        const response = await fetch('http://localhost:3000/event');
        if (!response.ok) {
            console.error('Network response was not ok');
            return Promise.reject('Network response was not ok');
        }
        const eventArray: EventModel[] = await response.json();
        console.log(eventArray[0]);

        return eventArray;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return Promise.reject(error);
    }
}


export default function Temp() {
    const [events, setEvents] = useState<EventModel[]>([]);
    useEffect(() => {
        fetchAPI().then(data => setEvents(data)).catch(console.error);
    }, []);
    console.log("Temp component rendered");
    return (
        <div className="event-grid">
            {events.map((event, index) => (
                <EventWidget key={index} event={event} />
            ))}
        </div>
    )
}