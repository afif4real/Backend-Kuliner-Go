import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.get('/', (req, res) => {
    res.send('Welcome to API Kuliner.Go')
})
app.listen(5000, ()=> console.log('Server up and running...'));

module.exports = app