import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>
=======
import { BrowserRouter } from 'react-router'
import { Routes, Route } from 'react-router'
import { Login } from './app/pages/login/login.jsx'
import { Register } from './app/pages/registration/Register.jsx'
import { Chat } from './app/pages/chat/chat.jsx'
import { Contacts } from './app/pages/contacts/Contacts.jsx'
import { Settings } from './app/pages/settings/Settings.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <App/> }/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='chat' element={<Chat/>}/>
      <Route path='contacts' element={<Contacts/>}/>
      <Route path='settings' element={<Settings/>}/>
    </Routes>
  </BrowserRouter>,
>>>>>>> 0437d668862a260121de3e64f1db40c216588f86
)
