const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MySQL database connection
const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'password',  // Update with your MySQL password
    database: 'testdb'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes for CRUD operations

// Create a new product
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;
    db.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id: result.insertId, name, price, description });
    });
});

// Read all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Read a single product
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result[0]);
    });
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    db.query('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?', [name, price, description, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

