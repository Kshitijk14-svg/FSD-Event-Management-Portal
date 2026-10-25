const { validationResult } = require('express-validator');

// Runs after express-validator chains; responds 400 with the first error message.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = validate;
