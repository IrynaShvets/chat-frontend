import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { toast } from "react-toastify";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Background from "../assets/background.png";

const sectionStyle = {
  width: "590px",
  height: "600px",
};

const imageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${Background})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "contain",
  backgroundSize: "auto auto",
};

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const socket = useRef();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
          navigate("/login");
        } else {
          setCurrentUser(
            await JSON.parse(
              localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            )
          );
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchChat();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchChat();
  }, [currentUser, navigate]);

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

          {!currentChat ? (
            <section style={imageStyle}>
              <div style={sectionStyle}>
                <h2>Hello {currentUser.username}</h2>
              </div>
            </section>
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
      {error && toast.error(error.message)}
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
