import express from "express"
import morgan from "morgan"
import SendEmail from "./utils/sendEmail.js"
import channel from "./config/mq.js"
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/api/status/healthz", (req, res) => {
    res.send("Hello, World!")
})
app.get("/api/status/readyz", (req, res) => {
    res.send("Hello, World!")
})
channel.consume("auth_notification_queue", async (msg) => {
    if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString())
        console.log("Received message : ", messageContent);
        try {
            const { email, action, html } = messageContent
            await SendEmail({ to: email, subject: action.split("_").join(" "), html })
            channel.ack(msg)
        } catch (error) {
            console.error(error);

        }
    } else {
        console.log("No message received");
    }
})

export default app