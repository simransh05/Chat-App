import { useState, useEffect } from "react";
import "./Chat.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const base_url = import.meta.env.VITE_BASE_URL;
import { jwtDecode } from "jwt-decode";
const socket = io(base_url);
import { fetchContacts } from "../../Slices/contactSlice";
import { fetchRecentChats } from "../../Slices/recentSlice";
import api from "../../utils/Api";
import SideBar from "../Sidebar/SideBar";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("login-info"))?.user
  );

  const [selectedUser, setSelectedUser] = useState({
    id: "",
    name: '',
    email: '',
    existsInUserDB: false,
    inviteSent: false
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [FontSize, setFontSize] = useState("normal");

  useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchRecentChats());
  }, [currentUser.name]);

  const normalizeMsg = (msg) => {
    if (!msg) return null;

    const senderName = typeof msg.sender === 'string' ? msg.sender : msg.sender?.name || "";
    const receiverName = typeof msg.receiver === 'string' ? msg.receiver : msg.receiver?.name || "";

    return {
      message: msg.message || msg.content || "",
      sender: senderName,
      receiver: receiverName
    };
  };


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
    if (currentUser.name) {
      socket.emit("register", currentUser.id);
    }
  }, [currentUser.id]);

  const handleInvite = async (email) => {
    try {
      const userData = JSON.parse(localStorage.getItem("login-info"));
      const id = userData?.user?.id;
      const sendData = { senderId: id, email }

      const res = await api.postInvite(sendData);
      dispatch(fetchContacts());
      setSelectedUser((prev) => ({ ...prev, inviteSent: true }));

    } catch (err) {
      console.error("Invite error:", err);
    }
  };

  useEffect(() => {
    console.log("receive")
    socket.on("receive_message", (data) => {
      const newData = normalizeMsg(data);

      setMessages(prev => [...prev, newData]);
    });

    return () => socket.off("receive_message");
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message || !selectedUser?.name) return;

    const msgData = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      message,
    };
    console.log(message)

    socket.emit("send_message", msgData, (res) => {
      console.log(res.status === 'ok')
      if (res.status === 'ok') {
        setMessages(prev => [
          ...prev,
          {
            sender: currentUser.name,
            receiver: selectedUser.name,
            message
          }
        ]);
        setMessage("");
      } else {
        console.log(res.message);
      }
    });
  };

  useEffect(() => {
    let saved = localStorage.getItem('font')
    if (saved) setFontSize(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('font', FontSize)
  }, [FontSize])

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="chat-app">

      <SideBar currentUser={currentUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setMessages={setMessages}
        getInitials={getInitials}
        setCurrentUser={setCurrentUser}
        normalizeMsg={normalizeMsg} />

      <div className="chat-area">
        {selectedUser?.name ? (
          selectedUser.existsInUserDB ? (
            <>
              <ChatHeader
                selectedUser={selectedUser}
                setFontSize={setFontSize}
                getInitials={getInitials}
                currentUser={currentUser}
                setMessages={setMessages}
                setSelectedUser={setSelectedUser}
              />

              <ChatBody
                messages={messages}
                selectedUser={selectedUser}
                FontSize={FontSize}
                currentUser={currentUser.name} />

              <ChatFooter
                handleSend={handleSend}
                message={message}
                setMessage={setMessage} />
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
