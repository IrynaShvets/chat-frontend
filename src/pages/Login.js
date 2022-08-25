import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginRoute } from "../utils/APIRoutes";
import Background from "../assets/background.png";

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

export default function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and password is required.");
      return false;
    } else if (password === "") {
      toast.error("Email and password is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <section style={imageStyle}>
      <div style={sectionStyle}>
        <FormContainer>
          <form action="" onSubmit={(event) => handleSubmit(event)}>
            <h2 className="title">Chat</h2>
            <input
              type="text"
              placeholder="Name"
              name="username"
              onChange={(e) => handleChange(e)}
              min="3"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <button type="submit">Log In</button>
            <span>
              Don't have an account? <Link to="/register">Create account.</Link>
            </span>
          </form>
        </FormContainer>
      </div>
    </section>
  );
}

const FormContainer = styled.div`
  @media screen and (max-width: 720px) {
    padding: 15px;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 35%;
    gap: 2rem;
    margin-left: auto;
    margin-right: auto;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
    @media screen and (max-width: 720px) {
      width: 100%;
      max-width: 720px;
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      width: 50%;
    }
  }
  h2 {
    font-size: 25px;
    color: #4e0eff;
    font-weight: bold;
  }
  input {
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: #00000076;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
    &:placeholder {
      color: red;
    }
  }
  button {
    background-color: #4e0eff;
    color: #00000076;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 20px;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff50;
      color: #fff;
    }
  }
  span {
    color: white;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
