import { useState } from 'react'
import axios from 'axios'
import navbarItems from './navbarItems'
import Navbar from '../components/navbar'
import { Navigate } from 'react-router-dom'

interface LoginResponse {
  message: string
  token: string
  redirectTo: string
}

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cv, setCV] = useState<File | null>(null)
  const [cvError, setCVError] = useState('')
  const [Error, setError] = useState('')
  const [redirectTo, setRedirectTo] = useState('')

  const [phoneNumber, setPhoneNumber] = useState('')
  const [birth, setBirth] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Cek apakah semua input terisi
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !cv ||
      !birth
    ) {
      setError('Please fill in all fields')
      return
    }

    // Validasi password
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match')
      return
    }

    // Validasi ekstensi file CV
    const fileExtension = cv.name.split('.').pop()?.toLowerCase()
    if (fileExtension !== 'pdf') {
      setError('Extension not allowed')
      return
    }

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('phoneNumber', phoneNumber)
      formData.append('cv', cv)
      formData.append('birth', birth)

      const response = await axios.post(
        'http://localhost:3000/register',
        formData,
      )

      if (response.status === 201) {
        sessionStorage.setItem('token', response.data.token)

        // Reset form fields
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setCV(null)
        setPhoneNumber('')
        setBirth('')

        if (response.data.message === 'User registered successfully') {
          // Auto Login
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })

          if (response.ok) {
            const data: LoginResponse = await response.json()

            if (data.message === 'Login successful') {
              // Simpan token autentikasi di sessionStorage
              sessionStorage.setItem('token', data.token)
              setRedirectTo(data.redirectTo)
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      setError(
        'Invalid registration format. Please check your inputs and try again.',
      )
    }
  }

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (fileExtension !== 'pdf') {
        setCVError('Extension not allowed')
        return
      }
      setCV(file)
    } else {
      setCV(null) // Atur nilai `cv` ke null jika tidak ada file yang dipilih
    }
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} />
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Register
          </h2>
        </div>
        {Error && (
          <p className="text-red-500 text-xs text-center mt-1">{Error}</p>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
            <div className='border border-gray-300 text-white'>
              <label htmlFor="cv" className="sr-only">
                Upload CV
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                required
                onChange={handleCVChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {cvError ? (
                <p className="text-red-500 text-xs mt-1">{cvError}</p>
              ):<small>Upload your CV file</small>}
            </div>
            <div>
              <label htmlFor="birth" className="sr-only">
                Birth Date
              </label>
              <input
                id="birth"
                name="birth"
                type="date"
                required
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Birth Date"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <Navbar navbarItems={navbarItems} />
    </div>
  )
}

export default RegisterPage
