import './App.css'
import { Link } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar.jsx';

function App() {
  return (
    <>
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
    </>
  )
}

export default App
