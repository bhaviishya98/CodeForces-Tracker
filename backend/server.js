import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js';
import exportRoutes from './routes/exportRoute.js';
import contestRoutes from './routes/contest.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
// app.use(cors());
app.use(express.json());

app.use('/api', studentRoutes);
app.use('/api', exportRoutes);
app.use("/api", contestRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Student Management API');
}); 


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});