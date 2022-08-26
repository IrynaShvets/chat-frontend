import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { XyzTransitionGroup } from "@animxyz/react";
import { setAvatarRoute } from "../utils/apiRoutes";
import Background from "../assets/background2.png";

const sectionStyle = {
  height: "100vh",
  width: "100vw",
};

const imageStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: `url(${Background})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "auto auto",
  padding: "40px",
};

export default function Avatar() {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiAvatar = `https://api.multiavatar.com/4645646`;

  useEffect(() => {
    const fetchChat = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        navigate("/login");
    };
    fetchChat();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please choose an avatar.");
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Sorry avatar not set, please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      try {
        const data = [];
        for (let i = 0; i < 5; i++) {
          const image = await axios.get(
            `${apiAvatar}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [apiAvatar]);

  return (
    <>
      {loading ? (
        <section style={imageStyle}>
          <div style={sectionStyle}>
            <Container>
              <img src={loader} alt="loader" className="loader" />
            </Container>
          </div>
        </section>
      ) : (
        <section style={imageStyle}>
          <div style={sectionStyle}>
            <Container>
              <div className="title-container">
                <div className="example-grid" xyz="fade small stagger">
                  <div classNameName="squareWrapper">
                    <div className="square xyz-in squareText">C</div>
                    <div className="square xyz-in squareText">h</div>
                    <div className="square xyz-in squareText">o</div>
                    <div className="square xyz-in squareText">o</div>
                    <div className="square xyz-in squareText">s</div>
                    <div className="square xyz-in squareText last">e</div>
                    <div className="square xyz-in squareText">a</div>
                    <div className="square xyz-in squareText">v</div>
                    <div className="square xyz-in squareText">a</div>
                    <div className="square xyz-in squareText">t</div>
                    <div className="square xyz-in squareText">a</div>
                    <div className="square xyz-in squareText">r</div>
                  </div>
                </div>

                <XyzTransitionGroup
                  className="example-grid"
                  xyz="fade small stagger"
                >
                  {false &&
                    [...Array(26)].map((_, index) => (
                      <div className="square" key={index} />
                    ))}
                </XyzTransitionGroup>
              </div>
              <div className="avatars">
                {avatars.map((avatar, index) => {
                  return (
                    <div
                      className={`avatar ${
                        selectedAvatar === index ? "selected" : ""
                      }`}
                    >
                      <img
                        src={`data:image/svg+xml;base64,${avatar}`}
                        alt="avatar"
                        key={avatar}
                        onClick={() => setSelectedAvatar(index)}
                      />
                    </div>
                  );
                })}
              </div>
              <button onClick={setProfilePicture} className="submit-btn">
                Choose avatar
              </button>
            </Container>
          </div>
        </section>
      )}
      {error && toast.error(error.message)}
    </>
  );
}

const Container = styled.div`
  flex-direction: column;
  padding: 40px;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    padding: 40px;
    h1 {
      color: #ffffff80;
      font-size: 40px;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 8px solid #ffffff80;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: #00000076;
    padding: 15px 30px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 10px;
    font-size: 25px;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff50;
      color: #fff;
    }
  }
`;
