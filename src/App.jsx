import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router'
import { Routes, Route } from 'react-router'
import { Home } from './app/pages/home/Home.jsx'
import { Login } from './app/pages/login/login.jsx'
import { Register } from './app/pages/registration/Register.jsx'
import { Chat } from './app/pages/chat/chat.jsx'
import { ContactsPage } from './app/pages/contacts/ContactsPage.jsx'

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
