import * as formik from 'formik';
import * as yup from 'yup';
import styles from './Login.module.css'
import { useNavigate } from 'react-router'; // get rid of this later
import MarginFix from '../../../components/MarginFix';


export function Login() {
    const navigate = useNavigate();
    MarginFix('decenter-mode');


    const onSubmit = () => {
        window.alert("Signing In...!")
        navigate('/chat');
    }

    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required().min(8, 'Password must be at least 8 characters'),
    })

    const {values, errors, touched, handleBlur, handleChange, handleSubmit} = formik.useFormik({
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
