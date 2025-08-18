import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../graphql/mutations';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [doRegister] = useMutation(REGISTER_MUTATION);

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h4>Register</h4>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    doRegister({ variables: { email, password, fullName, address, phone, role } });
                }}
            >
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="form-control mb-2"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="form-control mb-2"
                />

                <input
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-control mb-2"
                    required />
                <input
                    type="text"
                    placeholder="Address"
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control mb-2"
                    required />
                <input
                    type="text"
                    placeholder="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control mb-2"
                    required />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select mb-2">
                    <option value="USER">User</option>
                </select>
                <button type="submit" className="btn btn-success">Register</button>
            </form>
        </div>
    );
}
export default Register;