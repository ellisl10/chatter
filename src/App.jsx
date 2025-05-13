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
<<<<<<< HEAD
      <BrowserRouter>
        <Routes>
          {/* When adding new pages, add import your page name at the top and then copy the route code pattern and add new page name below */}
          <Route path="/" element={ <Home/> }/>
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='chat' element={<Chat/>}/>
          <Route path='contacts' element={<ContactsPage/>}/>
        </Routes>
      </BrowserRouter>,
=======
      <NavigationBar />
      <div style={{ textAlign: 'center', marginTop: 56 }}>
      <h1>Chatter</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/contacts">Contacts</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
>>>>>>> 0437d668862a260121de3e64f1db40c216588f86
    </>
  )
}

export default App
