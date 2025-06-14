import React, { useState } from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import styles from './Login.module.css'
import { useNavigate } from 'react-router';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";


export function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const onSubmit = async (values, actions) => {
        try {
            // Creating user with firebase auth
            const userCredential = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            const user = userCredential.user;
            console.log("logged in user: ", user)

            // Reset form after registration
            actions.resetForm();

            // Sign in the user
            navigate("/chat");

            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error logging in: ", errorCode, errorMessage);

                let message = "A login error occured. Please try again.";

                switch (errorCode) {
                    case "auth/invalid-credential":
                        message = "Invalid email or password. Please try again."
                        break;
                    case "auth/too-many-requests":
                        message = "Too many requests. Please try again later.";
                        break;
                    default:
                        message = "Login failed. Please try again.";
                }
                setLoginError(message);
            }
        }

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(8, 'Password must be at least 8 characters'),
    })

    const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            email: "",
            password: "",
        },   
        validationSchema: schema,
        onSubmit
    })

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.loginSection}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.chatter}>Chatter</h1>
                        <h1>Log In</h1>
                    </div>

                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.input}>
                                <input 
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="email" type="email" placeholder='Email' 
                                className={`${errors.email && touched.email ? styles.inputError : ""}`}
                                />
                                {errors.email && touched.email && <p className={styles.error}>{errors.email}</p>}
                            </div>
                            <div className={styles.input}>
                                <input 
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="password" type="password" placeholder="Password" 
                                className={`${errors.password && touched.password ? styles.inputError : ""}`} 
                                />
                                {errors.password && touched.password && <p className={styles.error}>{errors.password}</p>}
                            </div>
                            {loginError && <p className={styles.error}>{loginError}</p>}
                            <div className={styles.submitContainer}>
                                <button className={styles.submitButton} type="submit">Log In</button>
                            </div>
                        </form>
                    </div>
                    <div className={styles.forgotPassword}>Don't have an account yet? 
                        <a href='/register'> Create an account!</a>
                    </div>
                </div>

                <div className={styles.graphicSection}>
                    <img src="src/assets/mockup-ss.png" alt="" className={styles.responsive}/>
                </div>
            </div>
        </>
    )
}
