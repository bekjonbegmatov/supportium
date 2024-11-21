import React, { useState } from "react";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();


    // Email validation function
    const validateEmail = (email) => {
        return email.match(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        );
    };
    function checkValidation() {
        if (!validateEmail(email)){
            setError('Пожалуйста, введите валидную почту');
            return false;
        } else if (password.length < 8){
            setError('Парол не должен быть меньше 8 символов');
            return false;
        }
        setError('');
        return true
    }

    function login(){
        if (checkValidation()){
            const data = {
                email: email,
                password: password,
            };
            axios.post('http://127.0.0.1:8000/login/', data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    // Сохраняем токен в localStorage
                    const token = response.data.token;
                    localStorage.setItem('authToken', token);
                    navigate('/');
                    window.location.reload()
                } else {
                    alert('Something went wrong during registration.');
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    alert(error.response.data.error || 'Registration failed.');
                } else {
                    console.error('Error occurred:', error.message);
                    alert('Failed to connect to the server.');
                }
            });
        }

    }
    return (
        <div className="text-center">
            <div className="p-4 size-full  rounded-lg mt-14">
            <br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br />
            <h1 className="bold text-5xl">
                <strong>Авторизация</strong>
            </h1>
            {error && (
                <div>
                    <br />
                    <span className="text-red-900 font-bold w-80 p-2 bg-red-200 rounded-lg">
                        {error}
                    </span>
                    <br />
                </div>
            )}
            <br />
                <div className="">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                    />
                    <br />
                    <br />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Пароль"
                        className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                    />
                    <br />
                    <br />
                    <button
                        onClick={login}
                        type="submit"
                        className="bg-indigo-600 text-white p-2 w-80 rounded-lg font-bold hover:bg-indigo-500 duration-300"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>

  );
}

export default Login;
