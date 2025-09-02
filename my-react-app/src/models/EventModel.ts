export type EventModel = {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string; // ISO 8601 format idk
    imageUrl: string[];
    tags: string[];
}