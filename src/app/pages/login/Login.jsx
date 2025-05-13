import './Login.css'
import { Button } from 'react-bootstrap';

export function Login() {

    return (
        <>
            <div id='main-container'>
                <div id='login-section'>
                    <div className="title-container">
                        <h1 id='Chatter'>Chatter</h1>
                        <h2>Log In</h2>
                    </div>

                    <div className="inputs">
                        <div className="input">
                            <input 
                                type="text" 
                                placeholder='Username' 
                                />
                        </div>
                        <div className="input">
                            <input 
                                type="password" 
                                placeholder='Password' 
                                />
                        </div>
                    </div>


                    <div className="submit-container">
                        <div className="submit">
                            <Button className="" variant="primary" size="lg" href="/chat">
                                Sign in
                            </Button>
                        </div>
                    </div>
                    <div className="forgot-password">Don't have an account yet? <span>Create an account!</span></div>
                </div>



                {/* Add picture here still and figure out responsive design for picture size */}
                <div id="graphic-section">
                    <h1>Picture</h1>
                </div>
            </div>
        </>
    )
}
