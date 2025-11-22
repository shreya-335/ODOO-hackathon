import express from "express"
import cors from "cors"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const { Pool } = pg
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Test DB connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err)
  } else {
    console.log("Database connected successfully:", res.rows[0].now)
  }
})

// Routes

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, password, name],
    )
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Product Routes
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY createdat DESC")
    res.json(result.rows)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post("/api/products", async (req, res) => {
  const { name, sku, category, unitOfMeasure, initialStock } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO products (name, sku, category, unitOfMeasure, initialStock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, sku, category, unitOfMeasure, initialStock],
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Warehouse Routes
app.get("/api/warehouses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM warehouses")
    res.json(result.rows)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post("/api/warehouses", async (req, res) => {
  const { name, shortCode, address } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO warehouses (name, shortCode, address) VALUES ($1, $2, $3) RETURNING *",
      [name, shortCode, address],
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Receipt Routes
app.get("/api/receipts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM receipts ORDER BY createdat DESC")
    res.json(result.rows)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get("/api/receipts/generate-reference", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM receipts")
    const count = Number.parseInt(result.rows[0].count) + 1
    const reference = `WH/IN/${String(count).padStart(4, "0")}`
    res.json({ reference })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get("/api/receipts/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM receipts WHERE id = $1", [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Receipt not found" })
    }

    // Get receipt items
    const itemsResult = await pool.query(
      `SELECT ri.*, p.name, p.sku 
       FROM receiptItems ri 
       JOIN products p ON ri.productId = p.id 
       WHERE ri.receiptId = $1`,
      [id],
    )

    const receipt = result.rows[0]
    receipt.products = itemsResult.rows
    res.json(receipt)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post("/api/receipts", async (req, res) => {
  const { reference, supplierId, warehouseId, status } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO receipts (reference, supplierId, warehouseId, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [reference, supplierId, warehouseId, status],
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put("/api/receipts/:id", async (req, res) => {
  const { id } = req.params
  const { reference, receiveFrom, responsible, scheduleDate, status, products } = req.body

  try {
    // Start transaction
    await pool.query("BEGIN")

    // Update receipt
    const result = await pool.query(
      `UPDATE receipts 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id],
    )

    if (result.rows.length === 0) {
      await pool.query("ROLLBACK")
      return res.status(404).json({ error: "Receipt not found" })
    }

    // Delete existing items
    await pool.query("DELETE FROM receiptItems WHERE receiptId = $1", [id])

    // Insert new items
    if (products && products.length > 0) {
      for (const product of products) {
        await pool.query("INSERT INTO receiptItems (receiptId, productId, quantityReceived) VALUES ($1, $2, $3)", [
          id,
          product.id,
          product.quantity,
        ])
      }
    }

    await pool.query("COMMIT")
    res.json(result.rows[0])
  } catch (err) {
    await pool.query("ROLLBACK")
    res.status(400).json({ error: err.message })
  }
})

app.put("/api/receipts/:id/complete", async (req, res) => {
  const { id } = req.params
  const { products } = req.body

  try {
    await pool.query("BEGIN")

    // Update receipt status to Done
    await pool.query("UPDATE receipts SET status = $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2", ["Done", id])

    // Update stock ledger for each product
    if (products && products.length > 0) {
      for (const product of products) {
        await pool.query(
          `INSERT INTO stockLedger (productId, locationId, quantityChange, type, referenceId, notes) 
           VALUES ($1, 1, $2, 'receipt', $3, 'Receipt completed')`,
          [product.id, product.quantity, id],
        )
      }
    }

    await pool.query("COMMIT")
    res.json({ success: true, message: "Receipt completed successfully" })
  } catch (err) {
    await pool.query("ROLLBACK")
    res.status(400).json({ error: err.message })
  }
})

// Delivery Routes
app.get("/api/deliveries", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM deliveries ORDER BY createdat DESC")
    res.json(result.rows)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post("/api/deliveries", async (req, res) => {
  const { reference, fromWarehouse, toWarehouse, status } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO deliveries (reference, fromWarehouse, toWarehouse, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [reference, fromWarehouse, toWarehouse, status],
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Stock Adjustment Routes
app.post("/api/stock-adjustments", async (req, res) => {
  const { productId, locationId, countedQuantity, reason } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO stockAdjustments (productId, locationId, countedQuantity, reason) VALUES ($1, $2, $3, $4) RETURNING *",
      [productId, locationId, countedQuantity, reason],
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
