import React, { useState } from "react";
import { authService } from "../fBase";

const Auth = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    console.log(email);
    console.log(password);
    const onChange = (event) => {
        const { target: { name, value } } = event;
        console.log(event.target.name);

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                //crate account
                data = await authService.createUserWithEmailAndPassword(email, password)
            }
            else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password)
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount(prev => !prev);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Log in":"Create Account"}</span>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button >
            </div>
        </div>
    );
};
export default Auth;