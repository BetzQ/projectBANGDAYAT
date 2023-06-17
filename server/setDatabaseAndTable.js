const mysql = require('mysql2');

// Konfigurasi koneksi database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

// Membuka koneksi ke database MySQL
connection.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal: ' + err.stack);
    return;
  }

  console.log('Koneksi berhasil. Membuat database dan tabel...');

  // SQL untuk membuat database
  const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS Sheets';

  // Eksekusi query untuk membuat database
  connection.query(createDatabaseQuery, (err, results, fields) => {
    if (err) {
      console.error('Gagal membuat database: ' + err.stack);
      return;
    }

    console.log('Database berhasil dibuat.');

    // Memilih database
    connection.query('USE Sheets');

    // SQL untuk membuat tabel
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Sheets (
        id INT(255) NOT NULL,
        username VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
        email VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
        password VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
        upload_cv VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
        phone_number INT(11) NOT NULL,
        birth DATE NOT NULL,
        role VARCHAR(255) COLLATE utf8mb4_general_ci,
        PRIMARY KEY (id)
      );
    `;

    // Eksekusi query untuk membuat tabel
    connection.query(createTableQuery, (err, results, fields) => {
      if (err) {
        console.error('Gagal membuat tabel: ' + err.stack);
        return;
      }

      console.log('Tabel berhasil dibuat.');

      // Menutup koneksi database setelah selesai
      connection.end();
    });
  });
});
