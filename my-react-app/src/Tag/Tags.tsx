import './Tags.css';

export default function Tags({tags}: { tags: string[] }) {
    return (
        <div className="event-tags">
            {tags.map(tag => (
                <span className="event-tag" key={tag}>{tag}</span>
            ))}
        </div>
    );
}