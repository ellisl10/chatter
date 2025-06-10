import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './app/pages/home/Home.jsx'
import { Login } from './app/pages/login/Login.jsx'
import { Register } from './app/pages/registration/Register.jsx'
import { Chat } from './app/pages/chat/Chat.jsx'
import { ContactsPage } from './app/pages/contacts/ContactsPage.jsx'
import { Settings } from './app/pages/settings/Settings.jsx'
import { MyAccount } from './app/pages/settings/MyAccount.jsx'
import { Privacy } from './app/pages/settings/Privacy.jsx'
import { AboutUs } from './app/pages/settings/AboutUs.jsx'
import { EditMyAccount } from './app/pages/settings/EditMyAccount.jsx'
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
          <Route path='settings' element={<Settings/>}>
            <Route index element={<MyAccount />} />
            <Route path='privacy' element={<Privacy />} />
            <Route path='about-us' element={<AboutUs />} />
            <Route path='my-account/edit' element={<EditMyAccount />} />
          </Route>
        </Routes>
        <MessageToasts />
      </BrowserRouter>
    </>
  )
}

export default App
