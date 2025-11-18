import React from 'react'
import { useState } from "react";
function ChatHeader({selectedUser , setFontSize}) {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="chat-header">
            <div className="name">{selectedUser.name}</div>
            <div className="menu">
                <button onClick={() => setShowMenu(!showMenu)}>⋮</button>
                {showMenu && (
                    <div className="menu-options">
                        <button onClick={() => setFontSize("small")}>Small</button>
                        <button onClick={() => setFontSize("normal")}>Normal</button>
                        <button onClick={() => setFontSize("large")}>Large</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatHeader
