import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, world!" })
})

export default function SetUpRestAPI(port = 8080) {
    app.listen(port)
}