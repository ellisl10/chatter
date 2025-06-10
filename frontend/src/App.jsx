import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router'
import { Routes, Route } from 'react-router'
import { Home } from './app/pages/home/Home.jsx'
import { Login } from './app/pages/login/Login.jsx'
import { Register } from './app/pages/registration/Register.jsx'
import { Chat } from './app/pages/chat/Chat.jsx'
import { ContactsPage } from './app/pages/contacts/ContactsPage.jsx'
import { Settings } from './app/pages/settings/Settings.jsx'
import MessageToasts from './components/MessageToasts';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* When adding new pages, add import your page name at the top and then copy the route code pattern and add new page name below */}
          <Route path="/" element={ <Home/> }/>
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='chat' element={<Chat/>}/>
          <Route path='contacts' element={<ContactsPage/>}/>
          <Route path='settings' element={<Settings/>}/>
        </Routes>
        <MessageToasts />
      </BrowserRouter>
    </>
  )
}

export default App
