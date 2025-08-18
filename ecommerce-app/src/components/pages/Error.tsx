import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Something went wrong!</h4>
                        <p>We're sorry, an unexpected error occurred during login.</p>
                        <hr />
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Go Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
