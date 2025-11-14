import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Box, Tabs, Tab } from "@mui/material";
import io from "socket.io-client";
const base_url = import.meta.env.VITE_BASE_URL;
import { jwtDecode } from "jwt-decode";
const socket = io(`${base_url}`);
import axios from "axios"
import AddContact from "../AddContact/AddContact";
import { addContactLocal, fetchContacts } from "../../Slices/contactSlice";
import { fetchRecentChats } from "../../Slices/recentSlice";
import { fetchUsers } from "../../Slices/userSlice";

function Chat() {

  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact.contact);
  const recentChats = useSelector((state) => state.recent.chat);
  const users = useSelector((state) => state.user.users);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('login-info'));
  const currentUser = userData?.user?.name;

  const [selectedUser, setSelectedUser] = useState({
    name: '',
    existsInUserDB: false,
    inviteSent: false
  });
  const [message, setMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [messages, setMessages] = useState([]);
  const [FontSize, setFontSize] = useState("normal");
  const [showMenu, setShowMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBtn, setSelectedBtn] = useState('recentChat');
  const [showAddContact, setShowAddContact] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    dispatch(fetchContacts(currentUser));
    dispatch(fetchRecentChats(currentUser));
    dispatch(fetchUsers(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, selectedUser.name]);

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
      socket.emit("register", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const normalizeUser = (u) => ({
        name: u.name?.trim(),
        email: u.email || "",
        id: u._id || u.id || null,
      });

      const merged = [...recentChats, ...contacts].map(normalizeUser);
      const uniqueUsers = Array.from(
        new Map(merged.map((u) => [u.name.toLowerCase(), u])).values()
      );

      if (searchName.trim() === "") {
        setSearchResults(uniqueUsers);
      } else {
        const lower = searchName.toLowerCase();
        const match = uniqueUsers.filter((u) =>
          u.name.toLowerCase().includes(lower)
        );
        setSearchResults(match);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchName, recentChats, contacts, selectedBtn]);


  const handleInvite = async (email) => {
    try {
      const userData = JSON.parse(localStorage.getItem("login-info"));
      const id = userData?.user?.id;
      const sendData = { userId: id, email }

      const res = await axios.post(`${base_url}/invite`, sendData);
      setSelectedUser((prev) => ({ ...prev, inviteSent: true }));

    } catch (err) {
      console.error("Invite error:", err);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [selectedUser.name]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message || !selectedUser.name) return;

    const msgData = {
      sender: currentUser,
      receiver: selectedUser.name,
      message,
    };

    socket.emit("send_message", msgData, (res) => {
      if (res.status === 'ok') {
        setMessages((prev) => [...prev, msgData]);
        setMessage("");
      } else {
        console.log(res.message);
      }
    });
  };

  useEffect(() => {
    console.log("Updated selectedUser:", selectedUser);
  }, [selectedUser]);

  const handleUserClick = async (name) => {
    try {
      const freshContacts = [...contacts];        
      const freshUsers = [...users];

      const userExists = freshUsers.some(u => u.name === name);

      const contactEntry = freshContacts.find(c => c.name === name);

      const nextSelected = {
        name,
        existsInUserDB: userExists,
        inviteSent: contactEntry?.inviteSent === true   
      };
      setSelectedUser(nextSelected);
      if (userExists) {
        const res = await axios.get(
          `${base_url}/history?user1=${currentUser}&user2=${name}`
        );

        const formatted = res.data.map(m => ({
          sender: m.sender.name,
          receiver: m.receiver.name,
          message: m.content
        }));

        setMessages(formatted);
      }
    }
    catch (err) {
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

  const handleChange = (_, value) => {
    setSelectedBtn(value);
  };

  return (
    <div className="chat-app">

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="heading">
            <h2>{currentUser}'s Chat</h2>
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
                    key={user.id || user._id}
                    className="search-result-item"
                    onClick={() => {
                      handleUserClick(user.name)
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
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={selectedBtn} onChange={handleChange}>
              <Tab label="Recent Chat" value="recentChat" sx={{ width: '180px' }} />
              <Tab label="My Contact" value="myContact" sx={{ width: '180px' }} />
            </Tabs>
          </Box>
        </div>


        <ul className="user-list">
          {selectedBtn === "recentChat" ? (
            <>
              {recentChats.length > 0 ? (
                recentChats.map((chat, index) => (
                  <li
                    key={index}
                    className={`user-item ${selectedUser.name === chat.name ? "active-user" : ""}`}
                    onClick={() => handleUserClick(chat.name)}
                  >
                    <div className="user-info">
                      <div className="user-name">{chat.name}</div>
                      <div className="user-email">{chat.email}</div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="no-chat">No records found</div>
              )}
            </>
          ) : selectedBtn === "myContact" ? (
            <>
              {contacts.length > 0 ? (
                contacts.map((c, index) => (
                  <li
                    key={index}
                    className={`user-item ${selectedUser.name === c.name ? "active-user" : ""}`}
                    onClick={() => handleUserClick(c.name)}
                  >
                    <div className="user-info">
                      <div className="user-name">{c.name}</div>
                      <div className="user-email">{c.email}</div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="no-chat">No records found</div>
              )}

              <Button
                onClick={() => setShowAddContact(true)}
                variant="contained"
                color="primary"
                sx={{ m: 2 }}
              >
                Add Contact
              </Button>
            </>
          ) : null}
        </ul>

        <AddContact
          open={showAddContact}
          onClose={() => setShowAddContact(false)}
          onSuccess={(newContact) => dispatch(addContactLocal(newContact))}
        />
      </div>

      <div className="chat-area">
        {selectedUser.name ? (
          selectedUser.existsInUserDB ? (
            <>
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
            <>
              <div className="no-chat">
                <p>
                  {selectedUser.name} is not registered yet. You can invite them to
                  join the chat app.
                </p><br />

                {selectedUser.inviteSent ? (
                  <button disabled>✅ Invite Already Sent</button>
                ) : (
                  <button onClick={() => handleInvite(selectedUser.email)}>
                    📩 Send Invite
                  </button>
                )}
              </div>
            </>
          )
        ) : (
          <div className="no-chat">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default Chat;
