import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        required: true,
        default: Date.now
    },
    imageUrl : { type: [String] },
    tags : { type: [String] },
});

export default mongoose.model('event', eventSchema);