import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./home/Home";
import Chatbox from './component/Chatbox';
import { UserProvider } from './provider/UserProvider';


export default function App() {
  return (
      <UserProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/chatbox" element={<Chatbox />} />
        </Routes>
      </UserProvider>
    
  );
}
