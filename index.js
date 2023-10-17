import express from "express";
import cors from 'cors'
const port = process.env.PORT || 5000
const app = express()

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server in running 😊')
})

app.listen(port, () => {
    console.log(`Server is runing on http://localhost:${port}`);
})