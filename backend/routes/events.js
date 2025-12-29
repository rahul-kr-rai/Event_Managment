const router = require('express').Router();
const Event = require('../models/Event');

// GET ALL EVENTS
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE EVENT
router.post('/', async (req, res) => {
    const newEvent = new Event(req.body);
    try {
        const savedEvent = await newEvent.save();
        res.json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE EVENT
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;