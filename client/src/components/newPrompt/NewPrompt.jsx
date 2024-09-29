import React, { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import Upload from '../upload/upload'
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from '@tanstack/react-query';

const urlEndpoint = "https://ik.imagekit.io/cft6rwupr"
const VITE_API_URL = "http://localhost:2000"


const NewPrompt = ({ data }) => {

    console.log("data", data)

    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")

    const endRef = useRef(null)
    const formRef = useRef(null)
    // IN PRODUCTION WE DON'T NEED IT
    const hasRun = useRef(false);
    const queryClient = useQueryClient()

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    })

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello, I have 2 dogs in my house." }]
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }]
            }
        ],
        generationConfig: {
            // maxOutputTokens: 100
        }
    })

    useEffect(() => {
        endRef.current.scrollIntoView({ behaviour: "smooth" })
    }, [data, question, answer, img.dbData])


    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${VITE_API_URL}/api/chats/${data._id}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined
                }),
            }).then(
                (res) => {
                    // console.log("res", res.json())
                    res.json()
                }
            )
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient
                .invalidateQueries({ queryKey: ['chat', data._id] })
                .then(() => {
                    formRef.current.reset()
                    setQuestion("")
                    setAnswer("")
                    setImg({
                        isLoading: false,
                        error: "",
                        dbData: {},
                        aiData: {}
                    })
                })
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const add = async (text, isInitial) => {
        if (!isInitial)
            setQuestion(text)

        try {

            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );

            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text()
                console.log(chunkText)
                accumulatedText += chunkText
                setAnswer(accumulatedText)
            }

            mutation.mutate()

        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const text = e.target.text.value
        if (!text) return

        add(text, false)
    }

    useEffect(() => {
        if (!hasRun.current) {
            if (data?.history?.length == 1) {
                add(data.history[0].parts[0].text, true)
            }
        }
        hasRun.current = true
    }, [])


    return (
        <>
            {img.isLoading && <div className=''>Loading...</div>}
            {
                img.dbData?.filePath &&
                <IKImage
                    urlEndpoint={urlEndpoint}
                    path={img.dbData?.filePath}
                    width="300"
                    transformation={[{ width: "300" }]}
                />

            }
            {question && <div className="message user">{question}</div>}
            {
                answer &&
                <div className="message">
                    <Markdown>
                        {answer}
                    </Markdown>
                </div>
            }
            <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
                <Upload setImg={setImg} />
                <input id="file" type="file" multiple={false} hidden />
                <input type="text" name="text" placeholder='Ask anything...' />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt