import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";
import "bootstrap/dist/css/bootstrap.min.css";

function CoachChat() {
  const { user, isCoach } = useContext(LoginContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !isCoach()) {
      navigate("/login");
      return;
    }

    if (userId) {
      fetchUserDetails();
      fetchMessages();
    }
  }, [user, isCoach, navigate, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserDetails = async () => {
    try {
      const response = await authService.getUserProfile(userId);
      setSelectedUser(response.data.user || response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response?.status === 404) {
        alert("User not found");
      } else {
        alert("Failed to fetch user details");
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await authService.getMessages(user.id, userId);
      setMessages(response.data.messages || []);
      markMessagesAsRead();
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await authService.markMessagesAsRead(userId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);

      const messageData = {
        sender: { id: user.id },
        receiver: { id: userId },
        coach: { id: user.id },
        content: newMessage,
        messageType: "COACH_TO_USER"
      };

      const response = await authService.sendMessage(messageData);

      if (response.data.message) {
        setMessages((prev) => [...prev, response.data.chatMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">

      {/* Chat Header */}
      <div className="bg-success text-white p-3 shadow-sm">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">

            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-light btn-sm me-3"
                onClick={() => navigate("/coach/dashboard")}
              >
                <i className="bi bi-arrow-left"></i>
              </button>

              <div>
                <h5 className="mb-0 fw-bold">
                  Chat with {selectedUser?.fullName || selectedUser?.name || "User"}
                </h5>
                <small className="opacity-75">
                  {selectedUser?.email}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <span className="badge bg-warning text-dark me-3">
                {selectedUser?.subscriptionPlan || "FREE"}
              </span>

              <span className="badge bg-info me-3">
                {selectedUser?.goal || selectedUser?.fitnessGoal || "No Goal Set"}
              </span>

              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-person"></i>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div className="container-fluid py-3">

          {messages.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-dots fs-1 text-muted mb-3"></i>
              <p className="text-muted">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                {messages.map((message) => (
                  <div key={message.id} className="mb-3">
                    <div className={`d-flex ${
                      message.sender.id === user.id ? 'justify-content-end' : 'justify-content-start'
                    }`}>
                      <div className={`max-width-70 ${
                        message.sender.id === user.id ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`card ${
                          message.sender.id === user.id 
                            ? 'bg-success text-white' 
                            : 'bg-white border'
                        }`} style={{ maxWidth: '400px' }}>
                          <div className="card-body p-3">
                            <p className="mb-1">{message.content}</p>
                            <small className={`${
                              message.sender.id === user.id ? 'text-white-50' : 'text-muted'
                            }`}>
                              {formatTimestamp(message.createdAt)}
                            </small>
                          </div>
                        </div>
                        <div className={`small ${
                          message.sender.id === user.id ? 'text-end text-white-50' : 'text-muted'
                        }`}>
                          {message.sender.id === user.id ? 'You' : (message.sender.fullName || message.sender.name)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-top p-3">
        <div className="container-fluid">

          <form onSubmit={sendMessage} className="d-flex gap-2">

            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
            </div>

            <div className="d-flex gap-2">

              <button
                type="button"
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-paperclip"></i>
              </button>

              <button
                type="submit"
                className="btn btn-success"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <i className="bi bi-send-fill me-2"></i>
                )}
                Send
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
}

export default CoachChat;
