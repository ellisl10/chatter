import { useFormik } from 'formik';
import * as yup from 'yup';
import styles from './Register.module.css'
import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router'; // get rid of this later
import { setDoc, doc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';


export function Register() {
    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
        try {
            // check that username is unique
            const usernameQuery = query(
                collection(db, "users"),
                where("username", "==", values.username)
              );
              const usernameSnapshot = await getDocs(usernameQuery);
          
              if (!usernameSnapshot.empty) {
                alert("Username already taken. Please choose another.");
                actions.setSubmitting(false);
                return;
              }
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
            );
            const user = userCredential.user;

            // Set displayName in Firebase Auth
            await updateProfile(user, {
            displayName: values.username,
            username: values.username,
            });

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
            displayName: values.username,
            email: values.email,
            createdAt: serverTimestamp(),
            username: values.username,
            });

            console.log("User registered and profile created:", user);

            actions.resetForm();
            navigate("/chat");

        } catch (error) {
            console.error("Registration Error:", error.message);
            if (error.code === "auth/email-already-in-use") {
            console.log("This email is already in use. Try logging in instead.");
            }
        } finally {
            actions.setSubmitting(false);
        }
        };

    const schema = yup.object().shape({
        email: yup.string().email().required('Email is required'),
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Please confirm password').
                        min(8, 'Password must be at least 8 characters')
    })
    const {values, errors, touched, handleBlur, handleChange, handleSubmit}  = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },   
        validationSchema: schema,
        onSubmit
    });

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.regSection}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.chatter}>Chatter</h1>
                        <h1>Register</h1>
                    </div>

                    {/* add real submit handling like formReset() and checking with backend */}
                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.input}>
                                <input 
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id="email" type="email" placeholder="Email" 
                                    className={errors.email && touched.email ? styles.inputError : " "} 
                                />
                                {errors.email && touched.email && <p className={styles.error}>{errors.email}</p>}
                            </div>
                            <div className={styles.input}>
                                <input 
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="username" type="text" placeholder="Username" 
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
                            
                            <div className={styles.input}>
                                <input 
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="confirmPassword" type="password" placeholder="Confirm Password" 
                                className={errors.confirmPassword && touched.confirmPassword ? styles.inputError : " "}/>
                                {errors.confirmPassword && touched.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                            </div>

                            <div className={styles.submitContainer}>
                                <button className={styles.submitButton} type="submit">Create Account</button>
                            </div>
                        </form>
                    </div>

                    <div className={styles.forgotPassword}>Already have an account?
                        <a href='/login'> Log In</a>
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