import React, { useContext, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../provider/UserProvider';

export default function Home() {
  const { username, setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  function openChatBox() {
    if (username.trim() === '') {
      alert('Please enter a username before joining the chat.');
    } else {
      setUsername(username);
      navigate('/chatbox');
    }
  }

  return (
    <div className="register_page">
      <div>Register User</div>
      <input
        type="textbox"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button id="join_button" onClick={openChatBox}>
        Join Chat
      </button>
    </div>
  );
}


  


