import React from 'react'

function ChatFooter({ handleSend, setMessage, message }) {

    return (
        <form className="chat-footer" onSubmit={handleSend}>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
        </form>
    )
}

export default ChatFooter
