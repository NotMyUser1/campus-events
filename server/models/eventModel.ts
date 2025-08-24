import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : String,
    location : String,
    date : {
        type: Date,
        required: true,
        default: Date.now
    },
    imageUrl : { type: [String] },
    tags : { type: [String] },
});

export default mongoose.model('event', eventSchema);