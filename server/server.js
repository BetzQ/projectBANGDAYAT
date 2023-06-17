const mysql = require('mysql2')
const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const { format } = require('date-fns');
const { log } = require('console')

const app = express()
app.use(express.static('uploads'))
app.use(cors())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '.pdf')
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname)
    if (fileExtension !== '.pdf') {
      const error = new Error('Extension not allowed')
      error.status = 'BAD_REQUEST'
      return cb(error)
    }
    cb(null, true)
  },
})


// Konfigurasi koneksi ke MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sheets',
})

// Membuat koneksi ke database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err)
    return
  }
  console.log('Connected to MySQL database')
})

// Mengatur middleware untuk parsing body dalam format JSON
app.use(express.json())

// Mengatur session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set 'secure' to true if using HTTPS
      httpOnly: true,
      maxAge: 86400000, // 1 day in milliseconds
    },
  }),
)

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.status === 'BAD_REQUEST') {
    res.status(400).json({ error: 'Extension not allowed' })
  } else {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Middleware untuk memeriksa autentikasi pengguna
const checkAuthentication = (req, res, next) => {
  const sessionId = req.headers.authorization
  const storedSessionId = req.session.token

  if (sessionId !== storedSessionId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
}

// Endpoint untuk mendapatkan semua pengguna
app.get('/users', checkAuthentication, (req, res) => {
  // Proses query untuk mendapatkan data pengguna dari tabel users
  const sql = 'SELECT * FROM users'

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err)
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching users' })
    }

    res.status(200).json({ users: results })
  })
})

// Endpoint untuk registrasi pengguna
app.post('/register', upload.single('cv'), (req, res) => {
  const { username, email, password, phoneNumber, birth } = req.body;

  // Generate ID baru berdasarkan gabungan password
  const id = uuidv4();

  // Query untuk memeriksa apakah ada pengguna terdaftar sebelumnya
  const sqlSelect = 'SELECT COUNT(*) as userCount FROM users';

  connection.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Error selecting data:', err);
      return res
        .status(500)
        .json({ error: 'An error occurred while registering the user' });
    }

    // Mendapatkan jumlah pengguna yang terdaftar
    const userCount = result[0].userCount;

    // Jika tidak ada pengguna terdaftar, beri peran admin (role = 1)
    const role = userCount === 0 ? 1 : 0;

    // Proses insert data ke tabel users
    const sqlInsert =
      'INSERT INTO users (id, username, email, password, upload_cv, phone_number, birth, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const valuesInsert = [
      id,
      username,
      email,
      password,
      req.file.filename,
      phoneNumber,
      birth,
      role,
    ];

    // Menghasilkan token dengan pola gabungan username, password, dan id
    const tokenPattern = `${username}-${password}-${id}`;
    const token = crypto.createHash('md5').update(tokenPattern).digest('hex');

    // Generate URL CV
    const cvUrl = `http://localhost:3000/cv/${req.file.filename}`;

    // Store the token in the user's session
    req.session.token = token;
    req.session.user = {
      id,
      username,
      email,
      password,
      upload_cv: req.file.filename,
      phone_number: phoneNumber,
      birth,
      role,
    };

    // Insert data pengguna baru ke tabel users
    connection.query(sqlInsert, valuesInsert, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res
          .status(500)
          .json({ error: 'An error occurred while registering the user' });
      }

      res
        .status(201)
        .json({ message: 'User registered successfully', token, cvUrl });
    });
  });
});

// Endpoint untuk login pengguna
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Proses query untuk mencari pengguna berdasarkan username dan password
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?'
  const values = [username, password]

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching user:', err)
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching user' })
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const user = results[0]

    // Menghasilkan token dengan pola gabungan username, id, dan birth
    const tokenPattern = `${user.username}-${user.id}-${format(user.birth, 'MM/dd/yyyy')}`
    const token = crypto.createHash('md5').update(tokenPattern).digest('hex')

    // Menentukan URL redirect berdasarkan peran pengguna
    const redirectTo = user.role === 1 ? '/admindashboard' : '/dashboard'

    // Kirim token sebagai respons ke frontend
    res.status(200).json({ message: 'Login successful', token, redirectTo })
  })
})

// Endpoint untuk menghapus pengguna berdasarkan ID
app.delete('/user/:id', checkAuthentication, (req, res) => {
  const userId = req.params.id

  // Proses delete data dari tabel users
  const sql = 'DELETE FROM users WHERE id = ?'
  const values = [userId]

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err)
      return res
        .status(500)
        .json({ error: 'An error occurred while deleting the user' })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ message: 'User deleted successfully' })
  })
})

app.get('/cv/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, 'uploads', filename)
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading CV:', err)
      res.status(500).json({ error: 'An error occurred while downloading CV' })
    }
  })
})

// Middleware untuk memeriksa otorisasi pada setiap request ke '/dashboard'
const checkAuthorization = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// Endpoint untuk halaman dashboard
app.get('/dashboard', checkAuthorization, (req, res) => {
  // Menampilkan data dashboard
})

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
