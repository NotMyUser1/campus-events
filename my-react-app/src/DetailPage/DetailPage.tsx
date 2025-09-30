import './DetailPage.css'
import {useEffect, useState} from "react";
import type {EventModel} from "../models/EventModel.ts";
import {useNavigate, useParams} from "react-router";
import Tags from "../Tag/Tags.tsx";
import IconButton from "../IconButton/IconButton.tsx";
import {useAuth} from "../Context/AuthContext.tsx";
import EditSvg from "../svgs/edit.svg?react";


const fetchAPI = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:3000/event/${id}`);
        if (!response.ok) {
            console.error('Network response was not ok');
            return Promise.reject('Network response was not ok');
        }
        const event: EventModel = await response.json();

        return event;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return Promise.reject(error);
    }
}

export default function DetailPage() {
    const {eventId} = useParams<Record<string, string>>();
    const [event, setEvent] = useState<EventModel>();
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const {loggedIn} = useAuth();

    useEffect(() => {
        if (eventId) {
            fetchAPI(eventId).then(data => {
                setEvent(data);
                setError(undefined);
            }).catch(err => {
                setError(err instanceof Error ? err.message : String(err));
                setEvent(undefined);
            });
        }
    }, [eventId]);

    if (error) {
        return <div>Fehler: {error}</div>;
    }
    if (!event) {
        return <div>Lade...</div>;
    }
    console.log("DetailPage component rendered");
    return (
        <>
            <div className="event-detail-page">
                {loggedIn && (
                    <div className={"display-text"}>
                        <IconButton
                            icon={<EditSvg height="4rem" width="100%"/>}
                            label="bearbeiten"
                            onClick={() => {
                                navigate("/event/edit/" + event._id);
                            }}
                        />
                        <IconButton
                            icon={<EditSvg height="4rem" width="100%"/>}
                            label="löschen"
                            onClick={async () => {
                                try {
                                    const response = await fetch(`http://localhost:3000/event/${eventId}`, {
                                        method: "DELETE",
                                    });
                                    if (!response.ok) {
                                        throw new Error("Fehler beim Löschen des Events.");
                                    }
                                    navigate("/");
                                } catch (error) {
                                    console.error("Fehler:", error);
                                    alert("Fehler beim Löschen des Events.");
                                }
                            }}
                        />
                    </div>
                )}
                <div className="image-and-short-infos">
                    <div className="event-image">
                        <img src={event.imageUrl[0]} alt={event.title}/>
                    </div>
                    <div className="short-infos">
                        <h1 className="event-title">{event.title}</h1>
                        <p>{new Date(event.date).toLocaleDateString()}, {event.location}</p>
                        <Tags tags={event.tags}/>
                    </div>
                </div>
                <div className="event-description">
                    <p>{event.description}</p>
                </div>
            </div>
        </>
    )
}