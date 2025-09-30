import './CreateEditEventPage.css'
import {useState, useEffect, type FormEvent} from "react";
import {useParams} from "react-router-dom";
import type {EventModel} from "../models/EventModel.ts";
import {useNavigate} from "react-router";

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

const update = async (event: EventModel) => {
    const hasId = !!event._id;
    const url = hasId
        ? `http://localhost:3000/event/${event._id}`
        : `http://localhost:3000/event/`;
    const method = hasId ? "PATCH" : "POST";

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    });
    if (!response.ok) {
            throw new Error(`Fehler beim Speichern des Events: ${response.statusText} Hast du die Image URL korrekt angegeben?`);
        }

    return await response.json() as EventModel;
};

export default function CreateEditEventPage() {
    const {eventId} = useParams<Record<string, string>>();
    const [error, setError] = useState<string | null>(null);
    const [event, setEvent] = useState<EventModel | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (eventId) {
            fetchAPI(eventId).then(setEvent);
        }
    }, [eventId]);
    const [title, setTitle] = useState(event?.title ?? "");
    const [imageUrl, setImageUrl] = useState(event?.imageUrl[0] ?? "");
    const [location, setLocation] = useState(event?.location ?? "");
    console.log(event?.tags);
    const [tags, setTags] = useState((event?.tags ?? []).join(', '));
    const [description, setDescription] = useState(event?.description ?? "");
    const [date, setDate] = useState(event?.date?.slice(0, 10) ?? "");

    useEffect(() => {
        if (event) {
            setTitle(event.title ?? "");
            setImageUrl(event.imageUrl?.[0] ?? "");
            setLocation(event.location ?? "");
            setDescription(event.description ?? "");
            setDate(event.date?.slice(0, 10) ?? "");
            setTags((event.tags ?? []).join(', '));
        }
    }, [event]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const isoDate = date ? new Date(date).toISOString() : "";
        const tagsArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const eventData: EventModel = {
            _id: event?._id ?? "",
            title,
            location,
            description,
            date: isoDate,
            imageUrl: [imageUrl],
            tags: tagsArray
        };
        try {
            const result = await update(eventData);
            navigate("/event/" + result._id)
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setError(error.toString());
            console.error("Fehler beim Speichern des Events:", error);
        }
    };

    return (
        <>
            <form className="event-edit-form" onSubmit={handleSubmit}>
                <label>
                    Titel:
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        required
                        placeholder="https://example.com/image.png"
                    />
                </label>
                <label>
                    Ort:
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Datum:
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Tags (kommagetrennt, keine Leerzeichen in den Tags):
                    <input
                        type="text"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="cool, party, funny_movie_night"
                    />
                </label>
                <label>
                    Beschreibung:
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        rows={5}
                    />
                </label>
                <button type="submit">Speichern</button>
            </form>
            {error && (
                <div className="event-error" style={{color: "red", marginTop: "1rem"}}>
                    {error}
                </div>
            )}
        </>
    );
}