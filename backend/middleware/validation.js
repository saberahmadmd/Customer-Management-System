const validateCustomer = (req, res, next) => {
  const { first_name, last_name, phone_number } = req.body;

  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (first_name.length < 2 || last_name.length < 2) {
    return res.status(400).json({ error: "Name fields must be at least 2 characters long" });
  }

  if (!/^\+?\d{7,15}$/.test(phone_number)) {
    return res.status(400).json({ error: "Phone number must be 7-15 digits, optional + prefix" });
  }

  next();
};

const validateAddress = (req, res, next) => {
  const { address_details, city, state, pin_code } = req.body;

  if (!address_details || !city || !state || !pin_code) {
    return res.status(400).json({ error: "All address fields are required" });
  }

  if (pin_code.length < 4) {
    return res.status(400).json({ error: "PIN code must be at least 4 characters" });
  }

  next();
};

module.exports = { validateCustomer, validateAddress };