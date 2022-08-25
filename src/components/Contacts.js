import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GrSearch } from "react-icons/gr";
import { toast } from "react-toastify";

export default function Contacts({ contacts, changeChat, value, onChange }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="current-user">
            <div>
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                />
              </div>
              <SearchIcon>
                <GrSearch />
              </SearchIcon>

              <LabelSearch>
                <InputSearch
                  type="text"
                  value={value}
                  onChange={onChange}
                  placeholder="Search or start new chat"
                />
              </LabelSearch>
            </div>
          </div>

          <div className="contacts">
            <h2 className="title">Chat</h2>
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      )}
      {error && toast.error(error.message)}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 25% 73% 2%;
  overflow: hidden;
  background-color: #fff;
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    border-bottom: 1px solid #73757783;
    gap: 0.6rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;

        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      min-height: 80px;
      cursor: pointer;
      width: 100%;
      border-bottom: 1px solid #73757783;

      padding: 15px;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      transition: all 0.5s ease-in-out;
      border-bottom: 1px solid #23292eda;
      .username {
        h3 {
          color: #23292eda;
        }
      }
    }
  }

  .current-user {
    background-color: #0d0d30;

    padding: 15px;
    background-color: #c4c6ca;

    .avatar {
      img {
        height: 50px;
        max-inline-size: 100%;
        margin-bottom: 15px;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

const LabelSearch = styled.label``;

const SearchIcon = styled.span`
  position: absolute;
  top: 97px;
  left: 25px;
`;

const InputSearch = styled.input`
  width: 100%;
  color: #000000bf;
  outline: none;
  font-weight: bold;
  border-radius: 20px;
  height: 40px;
  border: 0;
  padding: 15px 30px;

  &::placeholder {
    color: #21212140;
    font-weight: bold;
  }
`;
