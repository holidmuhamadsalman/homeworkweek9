const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../query");

router.use(bodyParser.json());
router.post("/post", (req, res) => {
      const { id, email, gender, password, role } = req.body;
      pool.query("INSERT INTO users (id, email, gender, password, role) VALUES($1, $2, $3, $4, $5)", [id, email, gender, password, role], (err, result) => {
            if (err) {
                  throw err;
            }
            res.send("data berhasil ditambahkan");
      });
});

router.get("/paginate", (req, res) => {
      pool.query("SELECT * FROM users LIMIT 10", (err, result) => {
            if (err) {
                  throw err;
            }
            res.send(result.rows);
      });
});

router.put("/update/:id", (req, res) => {
      const id = parseInt(req.params.id);
      const { email, gender, password, role } = req.body;
      pool.query("UPDATE users SET email=$1, gender=$2, password=$3, role=$4 WHERE id=$5", [email, gender, password, role, id], (err, result) => {
            if (err) {
                  throw err;
            }
            res.send(`data berhasil di ubah`);
      });
});

router.delete("/delete/:id", (req, res) => {
      const id = parseInt(req.params.id);
      pool.query("DELETE FROM users WHERE id=$1", [id], (err, result) => {
            if (err) {
                  throw err;
            }
            res.send(`data berhasil di hapus`);
      });
});

// Endpoint register
router.post("/register", (req, res) => {
      const { id, email, gender, password, role } = req.body;

      // Validasi input data pengguna di sini jika diperlukan.

      const query = "INSERT INTO users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id";
      const values = [id, email, gender, password, role];

      pool.query(query, values, (error, result) => {
            if (error) {
                  res.status(500).json({ error: "Gagal mendaftar pengguna" });
            } else {
                  const userId = result.rows[0].id;
                  const token = jwt.sign({ userId, email }, "secretKey", { expiresIn: "1h" });
                  res.status(201).json({ token });
            }
      });
});

// Endpoint login
router.post("/login", (req, res) => {
      const { email, password } = req.body;

      const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
      const values = [email, password];

      pool.query(query, values, (error, result) => {
            if (error) {
                  res.status(500).json({ error: "Gagal masuk" });
            } else {
                  if (result.rows.length === 0) {
                        res.status(401).json({ error: "Email atau password salah" });
                  } else {
                        const userId = result.rows[0].id;
                        const token = jwt.sign({ userId, email }, "secretKey", { expiresIn: "1h" });
                        res.status(200).json({ token });
                  }
            }
      });
});

router.get("/verify/:token", (req, res) => {
      const data = jwt.verify(req.params.token, "secretKey");
      res.json({
            data: data,
      });
});

module.exports = router;
