import { Button, Navbar, Nav } from 'react-bootstrap';
import { NavigationBar } from '../../../components/NavigationBar';
import './Home.css';
// import { useContext } from 'react';

export const Home = () => {
    const isLoggedIn = true;
    return (
        <div className="home-page">
            { isLoggedIn ? <NavigationBar/> : 
            <Navbar expand="lg" className="navbar bg-body-tertiary" fixed="top">
                <Navbar.Brand href="/">
                    <img src="src/assets/chatter-logo.svg" className="chatter-logo" width="30" height="30" />
                    {' '}Chatter
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            }
            <h1>Welcome to Chatter!</h1>
            <div className="d-flex justify-content-center gap-2">
                <Button className="rounded-pill px-4" variant="primary" size="lg" href="/login">
                    Login
                </Button>
                <Button className="rounded-pill px-4" variant="outline-primary" size="lg" href="/register">
                    Register
                </Button>
            </div>
        </div>
    );
}