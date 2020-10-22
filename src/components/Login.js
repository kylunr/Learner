import React from 'react';
import './Login.css';
import { Button } from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import { auth, provider } from "../firebase";

/**
 * Component is used to log the user into
 * the application
 */
function Login() {

    /**
     * When user clicks sign in, the user is prompted 
     * to sign in with Google in a popup window
     */
    const signIn = () => {
        auth.signInWithRedirect(provider)
        .catch((error) => alert(error.message));
    }

    return (
        <div className="login">
            <div className="login_logo">
                <SchoolIcon style={{ fontSize: 300 }}/>
                <h1 className="title">Learner</h1>
            </div>

            <Button onClick={signIn}>Sign In</Button>
        </div>
    );    
}

export default Login;