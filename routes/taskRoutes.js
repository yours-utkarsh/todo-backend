import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create Task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      userId: req.userId,
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
});

// Get All User's Tasks
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.userId };

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
});

// Get Single Task
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task' });
  }
});

// Update Task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, description, status } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
});

// Delete Task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

export default router;
