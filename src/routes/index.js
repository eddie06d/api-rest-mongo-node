const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Task = require('../models/Task');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Hello World!'));

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, 'secretKey');

    res.status(200).json({ token });
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: 'User not found with that email' });
    }
    if (user.password !== password) {
        return res.status(401).json({ error: 'Password is incorrect' });
    }
    const token = jwt.sign({ userId: user._id }, 'secretKey');
    res.status(200).json({ token });
});

// CREATE
router.post('/task', async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.status(200).json({ mesage: 'Task saved successfully' });
});

// READ
router.get('/task/:id', async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
});

// UPDATE
router.put('/task/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
});

// DELETE
router.delete('/task/:id', async (req, res) => {
    const id = req.params.id;   
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
});

router.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
});

module.exports = router;

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(!bearerHeader) return res.status(401).json({ error: 'Unauthorized Request' });
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if(!bearerToken) return res.status(401).json({ error: 'Unauthorized Request' });
    const payload = jwt.verify(bearerToken, 'secretKey');
    req.userId = payload.userId;
    next();
}