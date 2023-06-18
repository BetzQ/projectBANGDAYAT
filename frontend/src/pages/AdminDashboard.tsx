import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import Navbar from '../components/navbar'
import { MD5 } from 'crypto-js'

const AdminDashboardPage = () => {
  interface User {
    id: string
    username: string
    email: string
    password: string
    upload_cv: string
    phone_number: string
    birth: string
    role: number
  }

  const navigate = useNavigate()

  const [userData, setUserData] = useState<User | null>(null)
  const [activeMenu, setActiveMenu] = useState('profile')
  const [webTitle, setWebTitle] = useState('Sheets')
  const [newWebTitle, setNewWebTitle] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
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

        setUsers(userData.users)

        // Jika ada pengguna yang cocok, berarti pengguna terautentikasi
        if (matchedUser && matchedUser.role == 1) {
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
    setActiveMenu(menuId)
  }

  const handleChangeWebTitle = () => {
    if (newWebTitle !== '') {
      setWebTitle(newWebTitle)
      setNewWebTitle('')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  if (!isAuthenticated) {
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
        <div className="flex items-center justify-center h-16 text-white font-bold text-2xl">
         <img src="../../R.png" alt="" width={30} className='mr-3'/> {webTitle}
        </div>
        <nav className="py-4">
          <ul>
            <li
              className={`py-2 px-4 hover:bg-gray-700 ${
                activeMenu === 'profile' ? 'bg-gray-700' : ''
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
                activeMenu === 'setting-web' ? 'bg-gray-700' : ''
              }`}
            >
              <a
                href="#setting-web"
                className="block text-white"
                onClick={() => handleMenuClick('setting-web')}
              >
                Setting Web
              </a>
            </li>
            <li
              className={`py-2 px-4 hover:bg-gray-700 ${
                activeMenu === 'user-list' ? 'bg-gray-700' : ''
              }`}
            >
              <a
                href="#user-list"
                className="block text-white"
                onClick={() => handleMenuClick('user-list')}
              >
                User List
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="w-3/4 px-8 py-4">
        {activeMenu === 'profile' && (
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

        {activeMenu === 'setting-web' && (
          <div id="setting-web" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Setting Web</h2>
            <form>
              <div className="mb-4">
                <label className="block font-medium mb-2">Change Here:</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={newWebTitle}
                  onChange={(e) => setNewWebTitle(e.target.value)}
                />
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                type="button"
                onClick={handleChangeWebTitle}
              >
                Simpan
              </button>
            </form>
          </div>
        )}

        {activeMenu === 'user-list' && (
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Password</th>
                <th className="py-2 px-4">Upload CV</th>
                <th className="py-2 px-4">No Handphone</th>
              </tr>
            </thead>
            <tbody>
              {users.map(
                (user) =>
                  // Cek jika user.role tidak sama dengan 1
                  user.role !== 1 ? (
                    <tr key={user.id}>
                      <td className="py-2 px-4">{user.username}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.password}</td>
                      <td className="py-2 px-4">{user.upload_cv}</td>
                      <td className="py-2 px-4">{user.phone_number}</td>
                    </tr>
                  ) : (
                    <tr key={user.id}>
                      <td className="pt-10 text-center" colSpan={5}>
                        Belum Ada User
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        )}
      </div>
      <Navbar
        navbarItems={[{ name: 'Logout', url: '/', onClick: handleLogout }]}
      />
    </div>
  )
}

export default AdminDashboardPage