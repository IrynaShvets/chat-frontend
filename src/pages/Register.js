import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { registerRoute } from "../utils/APIRoutes";
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
  padding: "30px",
};

export default function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirmation password must be the same.");
      return false;
    } else if (username.length < 3) {
      toast.error("Username must contain more than 2 characters.");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be 6 or more characters.");
      return false;
    } else if (email === "") {
      toast.error("Email is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
            />
            <button type="submit">Create User</button>
            <span>
              Have you an account? <Link to="/login">Login.</Link>
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
    padding: 3rem 5rem;
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
