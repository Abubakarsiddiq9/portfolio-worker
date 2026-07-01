export function validateContact({ name, email, message }) {

    // Ensure all fields are strings
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string"
    ) {
        return {
            valid: false,
            message: "Invalid request."
        };
    }

    // Normalize input
    name = name.trim();
    email = email.trim();
    message = message.trim();

    // Required fields
    if (!name || !email || !message) {
        return {
            valid: false,
            message: "All fields are required."
        };
    }

    // Length validation
    if (name.length > 100) {
        return {
            valid: false,
            message: "Name must be 100 characters or fewer."
        };
    }

    if (email.length > 254) {
        return {
            valid: false,
            message: "Email is too long."
        };
    }

    if (message.length > 2000) {
        return {
            valid: false,
            message: "Message must be 2000 characters or fewer."
        };
    }

    // Email validation
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return {
            valid: false,
            message: "Invalid email address."
        };
    }

    return {
        valid: true,
        data: {
            name,
            email,
            message
        }
    };
}