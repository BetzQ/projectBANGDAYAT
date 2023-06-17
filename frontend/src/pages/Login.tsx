import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import navbarItems from './navbarItems';
import Navbar from '../components/navbar';
import { MD5 } from 'crypto-js';

interface LoginResponse {
  message: string;
  token: string;
  redirectTo: string;
}

const LoginPage = () => {
  const [error, setError] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const username = e.currentTarget.username.value;
  const password = e.currentTarget.password.value;

  try {
    // Mengambil data pengguna dari http://localhost:3000/users
    const usersResponse = await fetch('http://localhost:3000/users');
    const usersData = await usersResponse.json();

    // Melakukan MD5 pada username dan password input
    const hashedUsernameInput = MD5(username).toString();
    const hashedPasswordInput = MD5(password).toString();

    // Melakukan iterasi untuk memeriksa setiap pengguna
    for (const user of usersData.users) {
      // Melakukan MD5 pada username dan password dari /users
      const hashedUsername = MD5(user.username).toString();
      const hashedPassword = MD5(user.password).toString();

      // Memeriksa kesamaan username dan password
      if (hashedUsernameInput === hashedUsername && hashedPasswordInput === hashedPassword) {
        
        // Jika cocok, melakukan permintaan POST ke backend untuk login
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data: LoginResponse = await response.json();

          if (data.message === 'Login successful') {
            // Simpan token autentikasi di sessionStorage
            sessionStorage.setItem('token', data.token);
            setRedirectTo(data.redirectTo);
          }
        } else {
          // Jika terdapat kesalahan, menampilkan pesan kesalahan
          const errorData = await response.json();
          setError(errorData.error);
        }

        // Menghentikan iterasi setelah menemukan pengguna yang cocok
        return;
      }
    }

    // Jika tidak ditemukan pengguna yang cocok
    setError('Invalid username or password');
  } catch (error) {
    setError('An error occurred while logging in');
  }
};

  

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-md rounded px-8 py-6"
          onSubmit={handleSubmit}
        >
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <Navbar navbarItems={navbarItems} />
    </div>
  );
};

export default LoginPage;
