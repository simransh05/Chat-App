import { useState, useEffect } from "react";
import "./Chat.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const base_url = import.meta.env.VITE_BASE_URL;
import { jwtDecode } from "jwt-decode";
const socket = io(`${base_url}`);
import { fetchContacts } from "../../Slices/contactSlice";
import { fetchRecentChats } from "../../Slices/recentSlice";
import { fetchUsers } from "../../Slices/userSlice";
import api from "../../utils/Api";
import SideBar from "../Sidebar/SideBar";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem('login-info'));
  const currentUser = userData?.user?.name;

  const [selectedUser, setSelectedUser] = useState({
    name: '',
    email: '',
    existsInUserDB: false,
    inviteSent: false
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [FontSize, setFontSize] = useState("normal");

  useEffect(() => {
    dispatch(fetchContacts(currentUser));
    dispatch(fetchRecentChats(currentUser));
  }, [currentUser]);

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

  const handleInvite = async (email) => {
    try {
      const userData = JSON.parse(localStorage.getItem("login-info"));
      const id = userData?.user?.id;
      const sendData = { senderId: id, email }

      const res = await api.postInvite(sendData);
      dispatch(fetchContacts(currentUser));
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
    let saved = localStorage.getItem('font')
    if (saved) setFontSize(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('font', FontSize)
  }, [FontSize])

  return (
    <div className="chat-app">

      <SideBar currentUser={currentUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setMessages={setMessages} />

      <div className="chat-area">
        {selectedUser.name ? (
          selectedUser.existsInUserDB ? (
            <>
              <ChatHeader
                selectedUser={selectedUser}
                setFontSize={setFontSize} />

              <ChatBody
                messages={messages}
                selectedUser={selectedUser}
                FontSize={FontSize}
                currentUser={currentUser} />

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
