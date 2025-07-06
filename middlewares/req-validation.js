import { body, query, matchedData, validationResult } from 'express-validator';

// Create validation rules
const loginValidationRules = [
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required').escape()
];

const registerValidationRules = [
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required').escape(),
    body("name").notEmpty().withMessage('Name is required').escape()
];

const genreRecommendationValidationRules = [
    query("genre").notEmpty().withMessage('genre is required').escape()
];

const userRecommendationValidationRules = [
    query("genre").notEmpty().withMessage('genre is required').escape(),
    query("preferredBookLength").notEmpty().isIn(["SHORT","MEDIUM","LONG"]).withMessage('preferredBookLength must be one of: SHORT, MEDIUM, LONG'),
    query("preferredMinimumPublicationYear").notEmpty().isInt().withMessage('preferredMinimumPublicationYear is required').escape()
];

const searchBookValidationRules = [
    query("type").notEmpty().isIn(["Title","ISBN"]).withMessage('type is required').escape(),
    query("value").notEmpty().withMessage('Value is required').escape(),
];

const getUserBookStatusValidationRules = [
    query("user_id").notEmpty().isAlphanumeric().withMessage('user_id is required').escape(),
    query("status").optional().escape(),
];

const getUserValidationRules = [
    query("id").notEmpty().isAlphanumeric().withMessage('user_id is required').escape(),
];

const updateUserValidationRules = [
    query("id").notEmpty().isAlphanumeric().withMessage('id is required').escape(),
    body("preferredGenres").optional().escape(),
    body("preferredBookLength").optional().isIn(["SHORT","MEDIUM","LONG"]).withMessage('preferredBookLength must be one of: SHORT, MEDIUM, LONG'),
    body("preferredMinimumPublicationYear").optional().isInt().withMessage('preferredMinimumPublicationYear must be an integer')
];

const getUserReadingStatusValidationRules = [
    query("user_id").notEmpty().isAlphanumeric().withMessage('user_id is required').escape(),
    query("book_id").notEmpty().isNumeric().withMessage('book_id is required').escape(),
];

const addUserValidationRules = [
    body('userDetails').isObject().withMessage('userDetails must be an object'),
    body('userDetails.id').notEmpty().isAlphanumeric().withMessage('user id is required and must be alphanumeric').escape(),
    body('userDetails.name').notEmpty().trim().withMessage('name is required').escape(),
    body('userDetails.email').notEmpty().isEmail().withMessage('valid email is required').normalizeEmail(),
    body('userDetails.preferredGenres').optional().isString().withMessage('preferredGenres must be a string').escape(),
    body('userDetails.preferredMinimumPublicationYear').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('preferredMinimumPublicationYear must be a valid year between 1800 and current year'),
    body('userDetails.preferredBookLength').optional().isIn(['SHORT', 'MEDIUM', 'LONG']).withMessage('preferredBookLength must be one of: SHORT, MEDIUM, LONG')
];

const updateUserReadingStatusValidationRules = [
    body('user_id').notEmpty().isAlphanumeric().withMessage('user_id is required and must be alphanumeric').escape(),
    body('book_id').notEmpty().isNumeric().withMessage('book_id is required and must be numeric').escape(),
    body('status').notEmpty().isIn(['WANT TO READ', 'READING', 'READ', ]).withMessage('status must be one of: WANT_TO_READ, READING, COMPLETED, DROPPED').escape(),
    body('bookDetails').isObject().withMessage('bookDetails must be an object'),
    body('bookDetails.ISBN').notEmpty().isNumeric().withMessage('ISBN is required').escape(),
    body('bookDetails.title').notEmpty().trim().withMessage('title is required').escape(),
    body('bookDetails.author').notEmpty().trim().withMessage('author is required').escape(),
    body('bookDetails.genre').optional().isString().withMessage('genre must be a string').escape(),
    body('bookDetails.description').optional().isString().withMessage('description must be a string').escape(),
    body('bookDetails.publicationYear').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('publicationYear must be a valid year between 1800 and current year'),
    body('bookDetails.coverArt').optional().isURL().withMessage('coverArt must be a valid URL')
];

// Middleware function
export function createValidationMiddleware(validators) {
    return function(req, res, next) {
        // Apply validation rules
        Promise.all(validators.map(validation => validation.run(req)))
            .then(() => {
                const errors = validationResult(req);
                if (errors.isEmpty()) {
                    // Validation passed, add validated data to request
                    req.validatedData = matchedData(req);
                    next();
                } else {
                    // Validation failed
                    res.status(400).json({ 
                        error: "Validation failed", 
                        details: errors.array() 
                    });
                }
            })
            .catch(error => {
                console.error('Validation error:', error);
                res.status(500).json({ error: "Validation error occurred" });
            });
    };
}

// Convenience functions for specific validations
export const loginValidation = createValidationMiddleware(loginValidationRules);
export const registerValidation = createValidationMiddleware(registerValidationRules);

export const genreRecommendationValidation = createValidationMiddleware(genreRecommendationValidationRules);
export const userRecommendationValidation = createValidationMiddleware(userRecommendationValidationRules);
export const searchBookValidation = createValidationMiddleware(searchBookValidationRules);
export const getUserBookStatusValidation = createValidationMiddleware(getUserBookStatusValidationRules);

export const getUserValidation = createValidationMiddleware(getUserValidationRules)
export const updateUserValidation = createValidationMiddleware(updateUserValidationRules);
export const getUserReadingStatusValidation = createValidationMiddleware(getUserReadingStatusValidationRules);
export const addUserValidation = createValidationMiddleware(addUserValidationRules);
export const updateUserReadingStatusValidation = createValidationMiddleware(updateUserReadingStatusValidationRules);



