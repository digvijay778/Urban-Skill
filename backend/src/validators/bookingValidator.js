const { body, param } = require('express-validator');

const createBookingValidator = [
  body('workerId')
    .notEmpty()
    .withMessage('Worker ID is required')
    .isMongoId()
    .withMessage('Invalid worker ID'),
  body('serviceCategory')
    .notEmpty()
    .withMessage('Service category is required')
    .isMongoId()
    .withMessage('Invalid service category ID'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Booking title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('scheduledDate')
    .notEmpty()
    .withMessage('Scheduled date is required')
    .isISO8601()
    .withMessage('Scheduled date must be a valid date'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => value >= 0)
    .withMessage('Budget cannot be negative'),
];

const updateBookingStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  body('status')
    .isIn(['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid status'),
];

module.exports = {
  createBookingValidator,
  updateBookingStatusValidator,
};
