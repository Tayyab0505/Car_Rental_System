const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/router');
const db = require('./config/db')

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const port = 3000;

app.get('/', (req, res) => {
    res.send('Home page');
});

app.listen(port, () => {
    console.log("Server is listening");
});