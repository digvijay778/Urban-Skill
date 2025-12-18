const { body } = require('express-validator');

const updateUserValidator = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address.city')
    .optional()
    .trim(),
  body('address.state')
    .optional()
    .trim(),
  body('address.zipCode')
    .optional()
    .trim(),
];

const updateWorkerProfileValidator = [
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('experience')
    .optional()
    .isNumeric()
    .withMessage('Experience must be a number')
    .custom((value) => value >= 0)
    .withMessage('Experience cannot be negative'),
  body('hourlyRate')
    .optional()
    .isNumeric()
    .withMessage('Hourly rate must be a number')
    .custom((value) => value >= 0)
    .withMessage('Hourly rate cannot be negative'),
];

module.exports = {
  updateUserValidator,
  updateWorkerProfileValidator,
};
