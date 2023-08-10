
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RegisterPage from './RegisterPage/RegisterPage.jsx'
import LoginPage from './LoginPage/LoginPage.jsx'
import ChatPage from './ChatPage/ChatPage.jsx'

import '../style/index.css'

const RouterApp = () => {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
