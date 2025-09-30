import './OverviewPage.css'
import type {EventModel} from "../models/EventModel.ts";
import {useEffect, useMemo, useState} from "react";
import EventWidget from "./EventWidget/EventWidget.tsx";
import IconButton from "../IconButton/IconButton.tsx";
import {useAuth} from "../Context/AuthContext.tsx";
import Plus from "../svgs/plus.svg?react";
import {useNavigate} from "react-router";

const fetchAPI = async (startDate?: string, endDate?: string) => {
    try {
        let url = 'http://localhost:3000/event?';
        if (startDate) url += `from=${encodeURIComponent(startDate)}&`;
        if (endDate) url += `to=${encodeURIComponent(endDate)}&`;
        url = url.slice(0, -1);

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Network response was not ok');
            return Promise.reject('Network response was not ok');
        }
        const eventArray: EventModel[] = await response.json();
        eventArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return eventArray;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return Promise.reject(error);
    }
}


export default function OverviewPage() {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState<string>('');
    const [searchTags, setSearchTags] = useState<string>('');
    const navigate = useNavigate();
    const {loggedIn} = useAuth();
    useEffect(() => {
        fetchAPI(startDate, endDate).then(data => setEvents(data)).catch(console.error);
    }, [startDate, endDate]);
    const searchTagArray = useMemo(() =>
            searchTags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
        [searchTags]
    );
    const filteredEvents = useMemo(() => {
        if (searchTagArray.length === 0) return events;
        return events.filter(event =>
            event.tags &&
            searchTagArray.every(tag =>
                event.tags.includes(tag)
            )
        );
    }, [events, searchTagArray]);
    console.log("OverviewPage component rendered");
    return (
        <>
            <div className="search-tags-row">
                Tags (kommagetrennt, keine Leerzeichen in den Tags):
                <input
                    type="text"
                    value={searchTags}
                    onChange={e => setSearchTags(e.target.value)}
                    placeholder="cool, party, funny_movie_night"
                    style={{flex: 1}}
                />
            </div>
            <div className="date-row">
                Von:
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    placeholder="Anfangsdatum"
                />
                Bis:
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    placeholder="Enddatum"
                />
            </div>
            {loggedIn && (
                <div className={"display-text"}>
                    <IconButton
                        icon={<Plus height="4rem" width="100%"/>}
                        label="hinzufügen"
                        onClick={() => {
                            navigate("/event/edit")
                        }}
                    />
                </div>
            )}
            <div className="event-grid">
                {filteredEvents.length === 0 && <p>Keine Events vorhanden. Sign in und erstelle ein Event. Oder verbinde eine MongoDB!</p>}
                {filteredEvents.map((event, index) => (
                    <EventWidget key={index} event={event}/>
                ))}
            </div>
        </>

    )
}