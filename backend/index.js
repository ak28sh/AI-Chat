import express from "express";
import cors from "cors";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import ImageKit from "imagekit";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";


const port = process.env.PORT || 2000;
const app = express();
app.use(express.json())

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
)

const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.log(err);
    }
  };
  

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})

app.get('/api/upload', (req, res) => {
    var result = imagekit.getAuthenticationParameters();
    res.send(result);
})

app.post('/api/chats', ClerkExpressRequireAuth(), async (req, res) => {
    // console.log(req.auth)
    const userId = req.auth.userId
    const { text } = req.body

    const user_id = userId.userId

    try {
        // Create a new chat
        const newChat = new Chat({
            userId: userId,
            history: [{ role: 'user', parts: [{text}]}]
        })

        const savedChat = await newChat.save()
        console.log("Saved chat")

        const userChat = await UserChats.find({userId: userId})

        // If user chat not exists then create new one
        if(!userChat.length) {
            const newUserChat = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40)
                    }
                ]
                
            })
            await newUserChat.save();
            console.log("New user chat saved")
        }else{
            // If user chat exists then push into array
            await UserChats.updateOne(
                { userId: userId },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40),

                        }
                    }
                }
            )
            console.log("User chat updated")
        }

        res.status(201).send(newChat._id)
        
    } catch(err) {
        console.log(err)
        res.status(500).send("Error creating chat!")
    }
})

app.get('/api/userChats', ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const userChat = await UserChats.find({userId})
        
        userChat.length 
        ? res.status(200).send(userChat[0].chats) 
        : res.status(200).send([])
    }catch (err) {
        console.log(err)
        res.status(500).send("Error fetching userchats!")
    }
})

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
  
    try {
      const chat = await Chat.findOne({ _id: req.params.id, userId });
  
      res.status(200).send(chat);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching chat!");
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body

    const newItem = [
        ...(
            question 
            ? [{ role: "user", parts: [{ text: question}], ...(img && {img}) } ]
            : []),
        { role: "model", parts: [{ text: answer}] }
    ]

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            {
                $push: {
                    history: {
                        $each: newItem
                    }
                }
            }
        )
        res.status(200).send(updatedChat)
    } catch (err) {
        res.status(500).send("Error adding conversation")
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
})

app.listen(port, () => {
    connect()
    console.log("Server running on 2000");
  });