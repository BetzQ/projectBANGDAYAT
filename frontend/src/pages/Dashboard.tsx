import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import { MD5 } from 'crypto-js'
import Inbox from './Inbox'

const DashboardPage = () => {
  interface User {
    username: string
    password: string
    id: string
    upload_cv: string
    phone_number: number
    email: string
    birth: string
  }

  const navigate = useNavigate()
  const [userData, setUserData] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [, setCvUrl] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      console.error(`⚠️ Fatal error in the script:
      from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    sql = 'SELECT * FROM users WHERE username = %s AND password = %s'
    values = (username, password)

    # Execute database query here using your preferred database library

    if len(results) == 0:
        return jsonify({'error': 'Invalid username or password'}), 401

    user = results[0]
    usernameResult = user['username']
    passwordResult = user['password']
    birthResult = user['birth']

    # username-password-birth
    tokenPattern = username + '-' + str(user['id']) + '-' + str(user['birth'])
    token = hashlib.md5(tokenPattern.encode()).hexdigest()

    redirectTo = '/admindashboard' if user['role'] == 1 else '/dashboard'

    return jsonify({'message': 'Login successful', 'token': token, 'redirectTo': redirectTo}), 200

if __name__ == '__main__':
    app.run()

  `)

      try {
        // Ambil data pengguna dari backend melalui API
        const response = await fetch('http://localhost:3000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()

        // Ambil data username, password, dan id dari session storage
        const storedToken = sessionStorage.getItem('token')

        // Cek setiap data pengguna dengan pola yang sama seperti token yang diharapkan
        const matchedUser = userData.users.find((user: User) => {
          const tokenPattern = `${user.username}-${user.id}-${new Date(
            user.birth,
          ).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          })}`

          const token = generateToken(tokenPattern)
          return token === storedToken
        })

        setCvUrl(matchedUser ? matchedUser.upload_cv : '')

        // Jika ada pengguna yang cocok, berarti pengguna terautentikasi
        if (matchedUser && matchedUser.role == '0') {
          setIsAuthenticated(true)
          setUserData(matchedUser)
        } else {
          sessionStorage.removeItem('token')
          navigate('/login')
        }
      } catch (error) {
        console.error('Error:', error)
        sessionStorage.removeItem('token')
        navigate('/login')
      }
    }

    fetchData()
  }, [navigate])

  const generateToken = (tokenPattern: string) => {
    const token = MD5(tokenPattern).toString()
    return token
  }

  const handleMenuClick = (menuId: string) => {
    setActiveTab(menuId)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  // Mengecek apakah token autentikasi ada di sessionStorage saat komponen pertama kali dirender
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  if (isAuthenticated == false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900">
        <div className="flex items-center justify-center h-16 text-white font-bold text-xl">
          hi, {userData ? userData.username : '*ERROR*'}
        </div>
        <nav className="py-4">
          <ul>
            <li
              className={`py-2 px-4 hover:bg-gray-700 ${
                activeTab === 'profile' ? 'bg-gray-700' : ''
              }`}
            >
              <a
                href="#profile"
                className="block text-white"
                onClick={() => handleMenuClick('profile')}
              >
                Profile / Data Diri
              </a>
            </li>
            <li
              className={`py-2 px-4 hover:bg-gray-700 ${
                activeTab === 'cv' ? 'bg-gray-700' : ''
              }`}
            >
              <a
                href="#cv"
                className="block text-white"
                onClick={() => handleMenuClick('cv')}
              >
                Link CV Pribadi
              </a>
            </li>
            <li
              className={`py-2 px-4 hover:bg-gray-700 ${
                activeTab === 'inbox' ? 'bg-gray-700' : ''
              }`}
            >
              <a
                href="#inbox"
                className="block text-white"
                onClick={() => handleMenuClick('inbox')}
              >
                Inbox
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="w-3/4 p-4">
        {/* Inbox */}
        {activeTab === 'inbox' && <Inbox />}
        {/* Profile / Data Diri */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-1/4 text-gray-600">Username</label>
                <span className="text-gray-800">
                  {userData ? userData.username : '*ERROR*'}
                </span>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-gray-600">Email</label>
                <span className="text-gray-800">
                  {userData ? userData.email : '*ERROR*'}
                </span>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-gray-600">Phone Number</label>
                <span className="text-gray-800">
                  {userData ? userData.phone_number : '*ERROR*'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Link CV Pribadi */}
        {activeTab === 'cv' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <a href="#" className='hover:text-gray-600'>{userData?.upload_cv}</a>
            {/* Konten halaman link CV pribadi */}
          </div>
        )}
      </div>
      <Navbar
        navbarItems={[{ name: 'Logout', url: '/', onClick: handleLogout }]}
      />
    </div>
  )
}

export default DashboardPage
