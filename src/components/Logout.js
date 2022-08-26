import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/apiRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <Button onClick={handleClick}>
      <BiLogOut />
    </Button>
  );
}

const Button = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  outline: 0;
  border: none;
  cursor: pointer;
  svg {
    font-size: 40px;
    color: #73757783;
  }
`;
