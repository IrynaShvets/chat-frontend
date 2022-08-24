import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import { api } from "../services/api";
/* import Welcome from "../components/Welcome"; */

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
    }
  }, []);

  /* useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      try {
        const { value } = await api();
        setTimeout(() => {
          console.log(value);
        }, 10000);
      } catch {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [error]); */

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const changeSearch = (e) => {
    setSearch(e.target.value);
  };

  const getContact = useMemo(() => {
    return contacts.filter((contact) =>
      contact.username?.toLowerCase().includes(search)
    );
  }, [search, contacts]);

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={getContact}
            changeChat={handleChatChange}
            onChange={changeSearch}
          />
          {/* 
            currentChat  === undefined ? (
            <Welcome />
          ) : (  ( */}
          <ChatContainer currentChat={currentChat} socket={socket} />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #d8dadd;
  .container {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: 35% 65%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
