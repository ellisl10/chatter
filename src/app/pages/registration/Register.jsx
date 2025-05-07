import { useState } from 'react';
import styles from './Register.module.css'

export function Register() {

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.loginSection}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.chatter}>Chatter</h1>
                        <h1>Register</h1>
                    </div>

                    {/* Need to add form validation */}
                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.input}>
                                <input 
                                type='email' 
                                name='email' 
                                placeholder='Email' 
                                onChange={handleChange} 
                                value={formData.email}
                                />
                            </div>
                            <div className={styles.input}>
                                <input 
                                type='text' 
                                name='username' 
                                placeholder='Username' 
                                onChange={handleChange} 
                                value={formData.username}
                                />
                            </div>
                            <div className={styles.input}>
                                <input 
                                type='password' 
                                name='password' 
                                placeholder='Password' 
                                onChange={handleChange} 
                                value={formData.password}
                                />
                            </div>
                            <div className={styles.input}>
                                <input 
                                type='password' 
                                name='confirmPassword' 
                                placeholder='Confirm Password' 
                                onChange={handleChange} 
                                value={formData.confirmPassword}
                                />
                            </div>
                            <div className={styles.submitContainer}>
                                <div className={styles.submit}>
                                    <button type='Submit'>Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={styles.forgotPassword}>Already have an account?
                        <a href='/register'> Log In</a>
                    </div>
                </div>


                {/* Fix gray area right of image on large screen sizes */}
                {/* Add dropshadow on image */}
                <div className={styles.graphicSection}>
                    <img src="src/assets/mockup-ss.png" alt="" className={styles.responsive} />
                </div>
            </div>
        </>
    )
}