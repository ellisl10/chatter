
import styles from './Login.module.css'

export function Login() {

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.loginSection}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.chatter}>Chatter</h1>
                        <h1>Log In</h1>
                    </div>

                    {/* Need to add form validation */}
                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <input type="text" placeholder='Username' />
                        </div>
                        <div className={styles.input}>
                            <input type="password" placeholder='Password' />
                        </div>
                    </div>

                    <div className={styles.submitContainer}>
                        <div className={styles.submit}>
                            <button>Sign In</button>
                        </div>
                    </div>
                    <div className={styles.forgotPassword}>Don't have an account yet? 
                        <a href='/register'> Create an account!</a>
                    </div>
                </div>


                {/* Fix gray area right of image on large screen sizes */}
                {/* Add dropshadow on image */}
                <div className={styles.graphicSection}>
                    <img src="src/assets/mockup-ss.png" alt="" className={styles.responsive}/>
                </div>
            </div>
        </>
    )
}
