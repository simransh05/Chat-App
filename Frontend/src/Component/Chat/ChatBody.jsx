import React from 'react'
import { useEffect, useRef } from "react";
function ChatBody({ messages, selectedUser, FontSize, currentUser }) {
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, selectedUser.name]);
    return (
        <div
            className="chat-body"
            style={{
                fontSize:
                    FontSize === "small"
                        ? "12px"
                        : FontSize === "normal"
                            ? "16px"
                            : "20px",
                overflowY: "auto",
            }}
            ref={chatBodyRef}
        >
            {messages
                .filter(
                    (msg) =>
                        (msg.sender === currentUser &&
                            msg.receiver === selectedUser.name) ||
                        (msg.sender === selectedUser.name &&
                            msg.receiver === currentUser)
                )
                .map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-bubble ${msg.sender === currentUser ? "sent" : "received"
                            }`}
                    >
                        {msg.message}
                    </div>
                ))}
        </div>
    )
}

export default ChatBody
