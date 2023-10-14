var express = require("express");
var router = express.Router();
var pool = require("../query");

pool.connect((err, res) => {
      if (err) {
            throw err;
      }
      console.log(`connected`);
});

router.post("/post", (req, res) => {
      const { id, title, genres, year } = req.body;
      pool.query("INSERT INTO movies (id, title, genres, year) VALUES($1, $2, $3, $4)", [id, title, genres, year], (err, result) => {
            if (err) {
                  throw err;
            }
            res.send("data berhasil ditambahkan");
      });
});

router.get("/paginate", (req, res) => {
      pool.query("SELECT * FROM movies LIMIT 10", (err, result) => {
            if (err) {
                  throw err;
            }
            res.send(result.rows);
      });
});

router.put("/update/:id", (req, res) => {
      const id = parseInt(req.params.id);
      const { title, genres, year } = req.body;
      pool.query("UPDATE movies SET title=$1, genres=$2, year=$3 WHERE id=$4", [title, genres, year, id], (err, result) => {
            if (err) {
                  throw err;
            }
            res.send(`data berhasil di ubah`);
      });
});

router.delete("/delete/:id", (req, res) => {
      const id = parseInt(req.params.id);
      pool.query("DELETE FROM movies WHERE id=$1", [id], (err, result) => {
            if (err) {
                  throw err;
            }
            res.send(`data berhasil di hapus`);
      });
});

module.exports = router;
