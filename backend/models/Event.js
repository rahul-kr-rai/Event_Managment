const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    capacity: { type: Number, required: true },
    mode: { type: String, enum: ['online', 'onsite', 'hybrid'], default: 'onsite' },
    status: { type: String, enum: ['draft', 'live', 'upcoming', 'past'], default: 'draft' },
    image: { type: String } // URL to image
});

module.exports = mongoose.model('Event', EventSchema);