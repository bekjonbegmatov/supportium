import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Email validation function
    const validateEmail = (email) => {
        return email.match(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        );
    };

    // Validation function
    function checkValidation() {
        if (!validateEmail(email)) {
            setError('Пожалуйста, введите валидную почту');
            return false;
        } else if (name.length < 5) {
            setError('Имя не должно быть меньше 5 символов');
            return false;
        } else if (lastName.length < 5) {
            setError('Фамилия не должна быть меньше 5 символов');
            return false;
        } else if (password !== rePassword) {
            setError('Пароли не совпадают');
            return false;
        }
        setError(''); // Clear error if validation passes
        return true;
    }

    // Register function
    function register() {
        if (checkValidation()) {
            // Формируем объект данных для отправки
            const data = {
                email: email,
                first_name: name,
                last_name: lastName,
                password: password,
            };
    
            // Отправляем запрос на сервер
            axios.post('http://127.0.0.1:8000/register/', data)
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
                    // Обрабатываем ошибки
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
            <br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br />
            <h1 className="bold text-5xl">
                <strong>Регистрация</strong>
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
            <div className="register">
                <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" placeholder="Email" 
                    className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                />
                <br /><br />
                <input 
                    onChange={(e) => setLastName(e.target.value)}
                    type="text" placeholder="Фамилия" 
                    className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                />
                <br /><br />
                <input 
                    onChange={(e) => setName(e.target.value)}
                    type="text" placeholder="Имя" 
                    className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                />
                <br /><br />
                <input 
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" placeholder="Пароль" 
                    className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                />
                <br /><br />
                <input
                    onChange={(e) => setRePassword(e.target.value)}
                    type="password" placeholder="Повторите пароль" 
                    className="bg-indigo-200 text-black rounded-lg p-2 w-80 placeholder-white::placeholder"
                />
                <br /><br />
                <button 
                    onClick={register} 
                    type="submit" 
                    className="bg-indigo-600 text-white p-2 w-80 rounded-lg font-bold hover:bg-indigo-500 duration-300"
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Register;
