const express = require("express");
const router = express.Router();
const db = require("../models/initDB");
const { validateCustomer } = require("../middleware/validation");

router.post("/", validateCustomer, (req, res) => {
  const { first_name, last_name, phone_number } = req.body;

  const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
  db.run(sql, [first_name, last_name, phone_number], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      first_name,
      last_name,
      phone_number,
      message: "Customer created successfully"
    });
  });
});

router.get("/", (req, res) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    city = "",
    state = "",
    pin_code = "",
    sortBy = "first_name",
    order = "ASC"
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const validSortColumns = ["first_name", "last_name", "phone_number", "city", "state"];
  if (!validSortColumns.includes(sortBy)) {
    sortBy = "first_name";
  }

  order = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let sql = `
    SELECT c.*, 
    GROUP_CONCAT(a.city) as cities,
    GROUP_CONCAT(a.state) as states,
    GROUP_CONCAT(a.pin_code) as pin_codes
    FROM customers c
    LEFT JOIN addresses a ON c.id = a.customer_id
  `;

  let whereClauses = [];
  let params = [];

  if (search) {
    whereClauses.push(`(c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone_number LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (city) {
    whereClauses.push(`a.city LIKE ?`);
    params.push(`%${city}%`);
  }

  if (state) {
    whereClauses.push(`a.state LIKE ?`);
    params.push(`%${state}%`);
  }

  if (pin_code) {
    whereClauses.push(`a.pin_code LIKE ?`);
    params.push(`%${pin_code}%`);
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  sql += ` GROUP BY c.id ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  let countSql = `
    SELECT COUNT(DISTINCT c.id) as total 
    FROM customers c
    LEFT JOIN addresses a ON c.id = a.customer_id
  `;

  if (whereClauses.length > 0) {
    countSql += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  db.get(countSql, params.slice(0, -2), (err, countResult) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    db.all(sql, params, (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const total = countResult.total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    });
  });
});

router.get("/:id", (req, res) => {
  const customerId = req.params.id;

  db.get("SELECT * FROM customers WHERE id = ?", [customerId], (err, customer) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    db.all("SELECT * FROM addresses WHERE customer_id = ?", [customerId], (err, addresses) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.json({
        ...customer,
        addresses: addresses || []
      });
    });
  });
});

router.put("/:id", validateCustomer, (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  const customerId = req.params.id;

  db.run(
    `UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE id=?`,
    [first_name, last_name, phone_number, customerId],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Phone number already exists" });
        }
        return res.status(400).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json({
        id: customerId,
        message: "Customer updated successfully"
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  const customerId = req.params.id;

  db.run("DELETE FROM customers WHERE id=?", [customerId], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({
      message: "Customer deleted successfully",
      deletedID: customerId
    });
  });
});

module.exports = router;