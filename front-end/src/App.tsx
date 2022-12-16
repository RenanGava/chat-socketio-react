import { FormEvent, useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import './App.css';

interface MessageChatProps {
    id: string,
    user: string,
    message: string
}

const socket = io("http://localhost:3333/")


function App() {

    const [username, setUsername] = useState('')
    const [message, setMessage] = useState('')
    const [messagesChat, setMessagesChat] = useState<MessageChatProps[]>([])

    function hanldeMessage(messageObject: MessageChatProps) {
        setMessagesChat(prevChat => [...prevChat, messageObject])
    }

    socket.off('receivedMessage').on('receivedMessage', message => {
        console.log(message);
        hanldeMessage(message)
    })

    socket.off('previousMessage').on('previousMessage', message => {
        setMessagesChat(message)
    })

    function hanldeSubmit(event: FormEvent) {
        event.preventDefault()

        if (username === '' || message === '') {
            return
        }

        const messageObject = {
            id: socket.id,
            user: username,
            message: message
        }

        // console.log('->', messageObject);

        hanldeMessage(messageObject)

        socket.emit('sendMessage', messageObject)

        setMessage('')
    }

    return (
        <div className="Container">
            <div className='Chat'>
                <form onSubmit={hanldeSubmit}>
                    <input
                        type="text"
                        placeholder='Digite seu nome'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <div className="Chat-message">
                        {
                            messagesChat.map((message, index) => {
                                return (
                                    <p
                                        // className='align-Right'
                                        key={index}
                                    >
                                        <span>
                                            { message.user }
                                        </span> {message.message}
                                    </p>
                                )
                            })
                        }

                    </div>
                    <input
                        type="text"
                        placeholder='Digite sua menssagem'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <button
                        className='button'
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;
