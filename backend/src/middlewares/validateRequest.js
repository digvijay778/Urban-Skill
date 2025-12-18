const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    console.log('Validation errors:', JSON.stringify(formattedErrors, null, 2));
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    throw new ApiError(400, 'Validation Error', formattedErrors);
  }

  next();
};

module.exports = validateRequest;
