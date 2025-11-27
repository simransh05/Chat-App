import React, { useEffect, useState, useRef } from 'react';

function ChatBody({ messages, selectedUser, FontSize, currentUser }) {
    const chatBodyRef = useRef(null);
    const [showButton, setShowButton] = useState(false);

    const scrollToBottom = () => {
        const el = chatBodyRef.current;
        if (el) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    const handleScroll = () => {
        const el = chatBodyRef.current;
        if (!el) return;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
        setShowButton(!atBottom);
    };

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
            onScroll={handleScroll} 
        >
            {messages.length === 0 ? (
                <div className="no-messages"></div>
            ) : (
                messages
                    .filter(
                        (msg) =>
                            (msg.sender === currentUser && msg.receiver === selectedUser.name) ||
                            (msg.sender === selectedUser.name && msg.receiver === currentUser)
                    )
                    .map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-bubble ${msg.sender === currentUser ? "sent" : "received"}`}
                        >
                            {msg.message}
                        </div>
                    ))
            )}
            {showButton && (
                <button className="scrollBtn" onClick={scrollToBottom}>
                    ↓
                </button>
            )}
        </div>
    );
}

export default ChatBody;