import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Login from "./Login.tsx";
import GithubCallback from "./GithubCallback.tsx";
import Notes from "./Notes.tsx";
import Note from "./Note.tsx";
import AuthPage from "./AuthPage.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />}>
          <Route path="" element={<App />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<Note />} />
        </Route>
        <Route path="/github/callback" element={<GithubCallback />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
