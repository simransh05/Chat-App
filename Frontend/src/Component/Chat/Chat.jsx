import { useState, useEffect } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const base_url = import.meta.env.VITE_BASE_URL;
import { jwtDecode } from "jwt-decode";
const socket = io(import.meta.env.VITE_BASE_URL, {
  withCredentials: true,       
  transports: ["websocket"],   
});
import { fetchContacts } from "../../Slices/contactSlice";
import { fetchRecentChats } from "../../Slices/recentSlice";
import api from "../../utils/Api";
import SideBar from "../Sidebar/SideBar";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { fetchCurrentUser } from "../../Slices/currentUserSlice";

function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .catch(() => {
        navigate("/login");
      });
  }, [dispatch, navigate]);


  const currentData = useSelector((state) => state.currentUser.users);
  const [currentUser, setCurrentUser] = useState(currentData);


  const contacts = useSelector((state) => state.contact.contact)
  const users = useSelector(state => state.user.users)

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [FontSize, setFontSize] = useState("normal");

  useEffect(() => {
    // console.log(currentUser)
    if (currentUser) {
      dispatch(fetchContacts(currentUser?._id));
      dispatch(fetchRecentChats(currentUser?._id));
    } else {
      navigate('/login')
    }
  }, [navigate, currentUser]);


  const normalizeMsg = (msg) => {
    if (!msg) return null;

    const senderId = msg.sender?._id || "";
    const receiverId = msg.receiver?._id || "";

    const senderName = msg.sender?.name || "";
    const receiverName = msg.receiver?.name || "";

    return {
      message: msg.message || msg.content || "",
      sender: senderName,
      receiver: receiverName,
      senderId,
      receiverId
    };
  };

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("register", currentUser._id);
    } else {
      return;
    }
  }, [currentUser?._id]);

  const handleInvite = async (email) => {
    try {
      const id = currentUser._id
      const sendData = { senderId: id, email }

      const res = await api.postInvite(sendData);
      dispatch(fetchContacts(currentUser?._id))
      setSelectedUser(prev => ({ ...prev, inviteSent: true }));

    } catch (err) {
      console.error("Invite error:", err);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const newData = normalizeMsg(data);

      setMessages(prev => [...prev, newData]);
      dispatch(fetchRecentChats(currentUser?._id));
    });

    return () => socket.off("receive_message");
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message || !selectedUser?.name) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId: selectedUser.id,
      message,
    };

    socket.emit("send_message", msgData, (res) => {
      if (res.status === 'ok') {
        setMessages(prev => [
          ...prev,
          {
            sender: currentUser.name,
            receiver: selectedUser.name,
            message,
            senderId: currentUser._id,
            receiverId: selectedUser.id
          }
        ]);
        setMessage("");
        dispatch(fetchRecentChats(currentUser._id))
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
        {selectedUser ? (
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
                currentUser={currentUser._id} />

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
