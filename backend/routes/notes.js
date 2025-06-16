const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middlewares/authMiddlewares');

// Create a note
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    try {
        const newNote = new Note({
            userId: req.user.userId,
            title,
            content
        });
        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (err) {
        console.error('Error creating note:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all notes for the user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId });
        res.json(notes);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a note
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.user.userId },
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note updated successfully", note: updatedNote });
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a note
router.delete('/:id', authMiddleware, async (req, res) => {
    const noteId = req.params.id;
    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: noteId,
            userId: req.user.userId
        });
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;