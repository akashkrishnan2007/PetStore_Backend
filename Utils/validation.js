// Validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate phone (10 digits, optionally prefixed with +91)
const isValidPhone = (phone) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone);

// Validate minimum password length
const isValidPassword = (password) => password && password.length >= 6;

module.exports = { isValidEmail, isValidPhone, isValidPassword };
