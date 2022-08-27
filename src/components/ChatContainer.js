import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatForm from "./ChatForm";
import Logout from "./Logout";
import { v4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { api } from "../services/api";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [valueApi, setValueApi] = useState();

  useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      try {
        const { value } = await api();
        setTimeout(() => {
          setValueApi(value);
        }, 10000);
      } catch {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [error]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });

        setMessages(response.data);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg, created) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      created: created,
    });
    const msgs = [...messages];
    console.log(msgs);
    msgs.push({ fromSelf: true, message: msg, created });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg, created) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
          created,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt=""
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
          <Logout />
        </div>
        <div className="chat-messages">
          {messages.map((message) => {
            return (
              <div className="chat-item" ref={scrollRef} key={v4()}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "recieved"
                  }`}
                >
                  <p className="content">{message.message}</p>
                  <p className="content-date">{message.created}</p>
                </div>
              </div>
            );
          })}
          {valueApi && currentChat && (
            <p className="jokes" ref={scrollRef}>
              {valueApi}
            </p>
          )}
        </div>

        <ChatForm handleSendMsg={handleSendMsg} />
      </Container>
      {error && toast.error(error.message)}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 12% 70% 18%;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    border: 1px solid #00000020;
    background-color: #c4c6ca;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 50px;
        }
      }
      .username {
        h3 {
          color: #00000080;
        }
      }
    }
  }
  .chat-messages {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: #d8dadd;
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .chat-item {
      display: flex;
      flex-direction: column;
    }
    .message {
      display: flex;
      .content {
        padding: 15px;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #73757783;
        color: #000000;
      }
      .content-date {
        color: #00000076;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #23292eda;
        color: #fff;
      }
      .content-date {
        color: #00000076;
      }
    }
    .jokes {
      justify-content: flex-start;
      background-color: #23292eda;
      color: #fff;
      max-width: 100%;
      padding: 15px;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
    }
  }
`;
