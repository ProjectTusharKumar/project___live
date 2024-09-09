import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Login/Login.css'; // Relative path to the CSS file
import { FaUserCircle } from 'react-icons/fa'; // Font Awesome icon
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons CSS
import Popup from '../Popup/Popup'; // Ensure Popup component is correctly imported
import { LOGIN_AUTH_TOKEN_KEY } from '../common/EnumValues';
import { getLoginDetails } from '../../services/login.data';
import {  messages } from '../common/ErrorMessages';
import { ROUTE_URLS } from '../common/RedirectURL';

function Login() {
    const [popup, setPopup] = useState({ show: false, title: '', message: '' });
    const [ loginObj, setLoginObj] = useState({
        employeeCode:'',
        password:''
    })
    
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await getLoginDetails(loginObj.employeeCode, loginObj.password);
            localStorage.setItem(LOGIN_AUTH_TOKEN_KEY, response.data.token);
            setPopup({ show: true, title: messages.login.SUCCESS_MSG_TITLE, message: messages.login.SUCCESS_MSG });
            setTimeout(() => {
                navigate(ROUTE_URLS.USER);
            }, 2000);
        } catch (error) {
            setPopup({ show: true, title: messages.login.ERROR_MSG_TITLE, message: messages.login.ERROR_MSG });
        }
    };

    const handleOnChange = (key, value) => {
        setLoginObj((prev) => {
            let prevObj = {...prev};
            prevObj[key] = value;
            return prevObj;
        })
    }

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-form">
                <div className="text-center mb-4">
                    <FaUserCircle className="login-icon" />
                </div>
                 

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
                                value={loginObj.employeeCode || ''}
                                onChange={(e) => handleOnChange('employeeCode', e.target.value)}
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
                                value={loginObj.password}
                                onChange={(e) => handleOnChange('password', e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
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
