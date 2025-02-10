import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import GithubCallback from './GithubCallback.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='login' element={<Login />} />
        </Route>
        <Route path='/github/callback' element={<GithubCallback />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
