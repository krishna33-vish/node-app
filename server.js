const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MySQL database connection
// const db = mysql.createConnection({
//     host: 'mysql-service',
//     user: 'root',
//     password: 'password',  // Update with your MySQL password
//     database: 'testdb'
// });


// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/testdb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));



// Define Mongoose Schema and Model
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
});
const Product = mongoose.model('Product', ProductSchema);


// Connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed: ' + err.stack);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// Routes for CRUD operations

// Create a new product
app.post('/products', async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const product = new Product({ name, price, description });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error("Error adding product:", err);  // Log error details
        res.status(500).json({ error: err.message });
    }
});

// app.post('/products', (req, res) => {
//     const { name, price, description } = req.body;
//     db.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description], (err, result) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json({ id: result.insertId, name, price, description });
//     });
// });




// Read all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        if (!Array.isArray(products)) {
            return res.status(500).json({ error: "Products data is not an array" });
        }
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});


// app.get('/products', (req, res) => {
//     db.query('SELECT * FROM products', (err, results) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(results);
//     });
// });

// Read a single product
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// app.get('/products/:id', (req, res) => {
//     const { id } = req.params;
//     db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(result[0]);
//     });
// });

// Update a product
app.put('/products/:id', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, price, description });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});


// app.put('/products/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, price, description } = req.body;
//     db.query('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?', [name, price, description, id], (err, result) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json({ message: 'Product updated successfully' });
//     });
// });

// Delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// app.delete('/products/:id', (req, res) => {
//     const { id } = req.params;
//     db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json({ message: 'Product deleted successfully' });
//     });
// });

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

