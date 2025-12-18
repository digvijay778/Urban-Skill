const { body, param } = require('express-validator');

const createReviewValidator = [
  param('bookingId')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  body('rating')
    .isNumeric()
    .withMessage('Rating must be a number')
    .custom((value) => value >= 1 && value <= 5)
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('categories.professionalism')
    .optional()
    .isNumeric()
    .custom((value) => value >= 1 && value <= 5)
    .withMessage('Rating must be between 1 and 5'),
  body('categories.communication')
    .optional()
    .isNumeric()
    .custom((value) => value >= 1 && value <= 5)
    .withMessage('Rating must be between 1 and 5'),
  body('categories.timeliness')
    .optional()
    .isNumeric()
    .custom((value) => value >= 1 && value <= 5)
    .withMessage('Rating must be between 1 and 5'),
  body('categories.qualityOfWork')
    .optional()
    .isNumeric()
    .custom((value) => value >= 1 && value <= 5)
    .withMessage('Rating must be between 1 and 5'),
];

module.exports = {
  createReviewValidator,
};
