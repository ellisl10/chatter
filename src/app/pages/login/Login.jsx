
import './Login.css'

export function Login() {

    return (
        <>
            <div id='main-container'>
                <div id='login-section'>
                    <div className="title-container">
                        <h1 id='Chatter'>Chatter</h1>
                        <h1>Log In</h1>
                    </div>

                    {/* Need to add form validation */}
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



                {/* Fix gray area right of image on large screen sizes */}
                {/* Add dropshadow on image */}
                <div id="graphic-section">
                    <img src="src/assets/mockup-ss.png" alt="" className='responsive'/>
                </div>
            </div>
        </>
    )
}
