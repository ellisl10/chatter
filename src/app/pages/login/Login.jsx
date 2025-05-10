import React from 'react';
import NavigationBar from '../../../components/NavigationBar';
import './Login.css'

export function Login() {

    return (
        <>
            <NavigationBar />

            <div id='main-container'>
                <div id='login-section'>
                    <div className="title-container">
                        <h1 id='Chatter'>Chatter</h1>
                        <h1>Log In</h1>
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
                            <button>Sign In</button>
                        </div>
                    </div>
                    <div className="forgot-password">Don't have an account yet? <span>Create an account!</span></div>
                </div>

                <div id="graphic-section">
                    <h1>Picture</h1>
                </div>
            </div>
        </>
    )
}
