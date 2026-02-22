export const validateProfileUpdate = (req, res, next) => {
    const { firstName, lastName, height, weight, activityLevel } = req.body
    
    const errors = []

    // Validate name fields
    if (firstName && firstName.length < 2) {
        errors.push('First name must be at least 2 characters long')
    }
    
    if (lastName && lastName.length < 2) {
        errors.push('Last name must be at least 2 characters long')
    }

    // Validate height and weight
    if (height && (isNaN(height) || height < 50 || height > 300)) {
        errors.push('Height must be between 50 and 300 cm')
    }
    
    if (weight && (isNaN(weight) || weight < 20 || weight > 500)) {
        errors.push('Weight must be between 20 and 500 kg')
    }

    // Validate activity level
    const validActivityLevels = ['sedentary', 'light', 'moderate', 'very', 'extra']
    if (activityLevel && !validActivityLevels.includes(activityLevel)) {
        errors.push('Invalid activity level')
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors 
        })
    }

    next()
}
