import { useState, useEffect } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const base_url = import.meta.env.VITE_BASE_URL;
import { jwtDecode } from "jwt-decode";
const socket = io(`${base_url}`);
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../Slices/userSlice";

function Chat() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user)
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [messages, setMessages] = useState([]);
  const [FontSize, setFontSize] = useState("normal");
  const [showMenu, setShowMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('login-info'));
  const currentUser = userData?.user?.name;

  useEffect(() => {
    const token = localStorage.getItem("login-info");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("login-info");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUsers(currentUser));
      socket.emit("register", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
  const handler = setTimeout(() => {
    if (searchName.trim() === "") {
      setSearchResults(users);
    } else {
      const lower = searchName.toLowerCase();
      const match = users.filter(u => 
        u.name.toLowerCase().includes(lower)   
      );
      setSearchResults(match);
    }
  }, 300); 
  return () => clearTimeout(handler);
}, [searchName, users]);


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [selectedUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message || !selectedUser) return;

    const msgData = {
      sender: currentUser,
      receiver: selectedUser,
      message,
    };

    socket.emit("send_message", msgData);

    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(
        `${base_url}/history?user1=${currentUser}&user2=${user}`
      );
      const data = await res.json();
      const formatted = data.map(m => ({
        sender: m.sender.name,
        receiver: m.receiver.name,
        message: m.content
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    let saved = localStorage.getItem('font')
    if (saved) setFontSize(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('font', FontSize)
  }, [FontSize])

  return (
    <div className="chat-app">

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="heading">
            <h2>Chats</h2>
            <button onClick={logout}>Logout</button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            {searchName && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="search-result-item"
                    onClick={() => {
                      setSelectedUser(user.name);
                      setSearchName("");
                      setSearchResults([]);
                    }}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ul className="user-list">
          {users.map((user, index) => (
            <li
              key={index}
              className={`user-item ${selectedUser === user.name ? "active-user" : ""
                }`} 
              onClick={() => handleUserClick(user.name)}
              
            >
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="name">{selectedUser}</div>
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

            <div className="chat-body" style={{
              fontSize: FontSize === "small" ? "12px" :
                FontSize === "normal" ? "16px" :
                  "20px"
            }}>
              {messages
                .filter(
                  (msg) =>
                    (msg.sender === currentUser && msg.receiver === selectedUser) ||
                    (msg.sender === selectedUser && msg.receiver === currentUser)
                )
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-bubble ${msg.sender === currentUser ? "sent" : "received"}`}
                  >
                    {msg.message}
                  </div>
                ))}
            </div>


            <form className="chat-footer" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default Chat;
