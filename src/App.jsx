import './App.css'
import { Link } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar.jsx';

function App() {
  return (
    <>
      <NavigationBar />
      <div>
        <h1>Chatter</h1>
      </div>
      <nav>
        {/* Add link to different pages here */}
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
        </ul>
      </nav>
    </>
  )
}

export default App
