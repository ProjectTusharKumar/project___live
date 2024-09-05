import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Login/Login.css'; // Relative path to the CSS file
import { FaUserCircle } from 'react-icons/fa'; // Font Awesome icon
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons CSS
import axiosInstance from '../common/axiosInstance'; // Import Axios
import Popup from '../Popup/Popup'; // Ensure Popup component is correctly imported

function Login() {
    const [popup, setPopup] = useState({ show: false, title: '', message: '' });
    const [employeeCode, setEmployeeCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', {
                employeeCode,
                password,
            });

            // Save the token in local storage
            localStorage.setItem('token', response.data.token);

            // Handle success response
            // console.log('Response:', response.data);
            setPopup({ show: true, title: 'Success', message: 'Login success' });
            
            // Navigate to the user page after a short delay (optional)
            setTimeout(() => {
                navigate('/user'); // Redirect to the user page
            }, 2000); // Adjust delay as needed (in milliseconds)
        } catch (error) {
            // Handle error response
            console.error('Error:', error);
            setPopup({ show: true, title: 'Error', message: 'Login failed' });
        }
    };
    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-form">
                <div className="text-center mb-4">
                    <FaUserCircle className="login-icon" />
                </div>
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="bi bi-person-fill"></i>
                                </span>
                            </div>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username" 
                                placeholder="Enter Employee Code" 
                                value={employeeCode}
                                onChange={(e) => setEmployeeCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="bi bi-lock-fill"></i>
                                </span>
                            </div>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
            <Popup 
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
      />
        </div>
    );
}

export default Login;
