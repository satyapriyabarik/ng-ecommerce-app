import { useMutation } from '@apollo/client';

import { LOGIN_MUTATION } from '../../graphql/mutations';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [doLogin] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            const { token, user } = data.login;
            login(token, user); // Call context to save token & user
            sessionStorage.setItem("token", data.login.token);
            sessionStorage.setItem("user", JSON.stringify(data.login.user));
            setTimeout(() => {
                navigate('/home');
            }, 200);
        },
        onError: () => {
            navigate('/error');
        }
    });


    return (
        <>
            <form onSubmit={e => { e.preventDefault(); doLogin({ variables: { email, password } }); }} className="container mt-5" style={{ maxWidth: '400px' }}>
                <h4 className="animate__animated animate__flip text-info">Login</h4>
                <div className="mb-3">
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="form-control" />
                </div>
                <div className="mb-3">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="form-control" />
                </div>
                <div className="mb-3  text-end">
                    <button type="submit" className="btn btn-success">Login</button>
                </div>
            </form>
            <div className="text-center mt-3">
                <p>Don't have an account? <a href="/register">Register here</a>.</p>
            </div>

        </>
    );
}
