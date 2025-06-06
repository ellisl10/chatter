import {useFormik} from 'formik';
import * as yup from 'yup';
import styles from './Login.module.css'
import { useNavigate } from 'react-router'; // get rid of this later


export function Login() {
    const navigate = useNavigate();


    const onSubmit = async () => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }

            const user = await response.json();
            console.log('Logged in as:', user);
            navigate('/chat');
        } catch(err) {
            console.error(err.message);
        }
    }

    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required().min(8, 'Password must be at least 8 characters'),
    })

    const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            username: "",
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

                    {/* Need to add form validation */}
                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.input}>
                                <input 
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="username" type="text" placeholder='Username' 
                                className={errors.username && touched.username ? styles.inputError : " "}
                                />
                                {errors.username && touched.username && <p className={styles.error}>{errors.username}</p>}
                            </div>
                            <div className={styles.input}>
                                <input 
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="password" type="password" placeholder="Password" 
                                className={errors.password && touched.password ? styles.inputError : " "} 
                                />
                                {errors.password && touched.password && <p className={styles.error}>{errors.password}</p>}
                            </div>
                            <div className={styles.submitContainer}>
                                <button className={styles.submitButton} type="submit">Log In</button>
                            </div>
                        </form>
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
