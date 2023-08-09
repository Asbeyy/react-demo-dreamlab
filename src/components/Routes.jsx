
import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RegisterPage from './register_page/RegisterPage.jsx'
import LoginPage from './login_page/LoginPage.jsx'
import ChatPage from './chat_page/ChatPage.jsx'

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
