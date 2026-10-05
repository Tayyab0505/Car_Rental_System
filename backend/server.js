const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

const routes = require('./routes/router')

require('./config/db')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
)

app.use('/api', routes)

app.get('/', (req, res) => {
    res.send('DriveEase API is running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})