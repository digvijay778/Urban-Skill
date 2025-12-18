const { body, param } = require('express-validator');

const createReviewValidator = [
  param('bookingId')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  body('rating')
    .isNumeric()
    .custom((value) => {
      const num = Number(value);
      return num >= 1 && num <= 5;
    })
    .withMessage('Rating must be a number between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
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
