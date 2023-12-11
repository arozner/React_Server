import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = () => {

    const { register, handleSubmit, reset } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (data) => {
        fetch(`http://localhost:4000/users?username=${data.username}&website=${data.password}`)
            .then(response => response.json())
            .then(userData => {
                const user = userData[0];
                if (user) {
                    navigate(`/user/${user.id}`);
                } else {
                    alert(`We don't know you... Please register`);
                }
            })
            .catch(() => alert(`error`));
        reset();
    };
   
    return <form onSubmit={handleSubmit(onSubmit)}>
        <label>
            <input
                type="text"
                placeholder='username'
                {...register('username', { required: true })}
            />
        </label>
        <br />
        <label>
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder='password'
                {...register('password', { required: true })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
        </label>
        <br />
        <button type="submit">login</button>
    </form>
}

export default Login