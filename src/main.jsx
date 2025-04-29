import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Routes, Route } from 'react-router'
import { Login } from './app/pages/login/login.jsx'
import { Register } from './app/pages/registration/Register.jsx'
import { Chat } from './app/pages/chat/chat.jsx'
import { Contacts } from './app/pages/contacts/Contacts.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <App/> }/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='chat' element={<Chat/>}/>
      <Route path='contacts' element={<Contacts/>}/>
    </Routes>
  </BrowserRouter>,
)
