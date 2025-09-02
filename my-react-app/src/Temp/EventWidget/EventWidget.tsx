import type {EventModel} from "../../models/EventModel.ts";
import './EventWidgets.css'
import {Link} from "react-router";

type EventWidgetProps = {
    event: EventModel;
};

export default function EventWidget({event}: EventWidgetProps) {
    console.log('EventWidget rendered');
    return (
        <Link to={`/event/${event._id}`} className="event-link">
            <div className='event-widget'>
                <img src={event.imageUrl[0]}/>
                <h2>{event.title}</h2>
                <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
        </Link>
    );
}
