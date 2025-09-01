const express = require("express");
const router = express.Router();
const db = require("../models/initDB");
const { validateAddress } = require("../middleware/validation")

router.post("/:customerId/addresses", validateAddress, (req, res) => {
  const { customerId } = req.params;
  const { address_details, city, state, pin_code } = req.body;

  db.get("SELECT id FROM customers WHERE id = ?", [customerId], (err, customer) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    db.run(
      `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`,
      [customerId, address_details, city, state, pin_code],
      function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        res.status(201).json({
          id: this.lastID,
          customerId,
          address_details,
          city,
          state,
          pin_code,
          message: "Address added successfully"
        });
      }
    );
  });
});

router.get("/:customerId/addresses", (req, res) => {
  const { customerId } = req.params;

  db.get("SELECT id FROM customers WHERE id = ?", [customerId], (err, customer) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    db.all(`SELECT * FROM addresses WHERE customer_id = ?`, [customerId], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.json(rows);
    });
  });
});

router.put("/address/:addressId", validateAddress, (req, res) => {
  const { address_details, city, state, pin_code } = req.body;
  const addressId = req.params.addressId;

  db.run(
    `UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?`,
    [address_details, city, state, pin_code, addressId],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Address not found" });
      }

      res.json({
        id: addressId,
        message: "Address updated successfully"
      });
    }
  );
});

router.delete("/address/:addressId", (req, res) => {
  const addressId = req.params.addressId;

  db.run(`DELETE FROM addresses WHERE id=?`, [addressId], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({
      message: "Address deleted successfully",
      deletedID: addressId
    });
  });
});

module.exports = router;