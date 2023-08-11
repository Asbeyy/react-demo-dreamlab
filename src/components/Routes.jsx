import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegisterPage from "./RegisterPage/RegisterPage.jsx";
import LoginPage from "./LoginPage/LoginPage.jsx";
import ChatPage from "./ChatPage/ChatPage.jsx";

import NotFound from "./Redirects/404.jsx";

import "../style/index.css";

const RouterApp = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/:id" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
