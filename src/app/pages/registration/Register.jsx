import * as formik from 'formik';
import * as yup from 'yup';
import styles from './Register.module.css'

export function Register() {

    // I should lowkey just use react bootstrap and make it easier

    const {values, handleBlur, handleChange}  = formik.useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },   
    });

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup.string().required().min(8, 'Password must be at least 8 characters'),
        confirmPassword: yup.string().required().min(8, 'Password must be at least 8 characters')
    })

    console.log(values)
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
                        <form>
                            <input 
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="email" type="email" placeholder="Email" />
                            <input 
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="username" type="text" placeholder="Username" />
                            <input 
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="password" type="password" placeholder="Password" />
                            <input 
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="confirmPassword" type="password" placeholder="Confirm Password" />
                            <button type="submit">Create Account</button>
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