import React, { Fragment, useState } from "react";
import styles from './login.module.css'

const LogIn = ({setAuth}) => {
    const [identity, setIdentity] = useState(""); // This can be either email or phone number
    const [password, setPassword] = useState("");
    const handleAdminPage = () => { 
        window.location = "/admin";
    };
    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { identity, password };
            const response = await fetch("http://localhost:5000/logIn", { 
                method: "POST",
                credentials: 'include', 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            if (response.ok) {
                setAuth(true);
                localStorage.setItem('token',parseRes.token);
                window.location = "/dashboard";
                console.log("Login Successful");
                
            } else {
                // Handle errors, e.g., show an error message
                console.error("Failed to log in__");
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            <div className={styles.container}>
               <span>
                <div className={styles.login_box}>
                    <p className={styles.headname}>LOG IN</p>

                    <form onSubmit={onSubmitForm} className={styles.formName}>
                        <div className={styles.user_box}>
                            <input type="text" required value={identity} onChange={e => setIdentity(e.target.value)} />
                            <label>EMAIL/PHONE NUMBER</label>
                        </div>
                        <div className={styles.user_box}>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                            <label>PASSWORD</label>
                        </div>

                        <center>
                            <button className={styles.animated_button}>
                                <span>SUBMIT</span>
                                <span></span>
                                </button>
                            </center>
                            <center>
                            <button onClick={handleAdminPage}>Admin</button>
                            </center>
                    </form>
                    </div>
                    
                </span>
            </div>
        </Fragment>
    )
};

export default LogIn;
