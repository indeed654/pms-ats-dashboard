const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const testData = [
    { email: "admin@ats.local", password: "Admin@123" },
    { email: "test@example.com", password: "password123" },
    { email: "admin@ats.local", password: "Admin@123" }
];

testData.forEach((data, index) => {
    const { error, value } = schema.validate(data);
    console.log(`Test ${index + 1}:`, JSON.stringify(data));
    if (error) {
        console.log('Error:', error.message);
    } else {
        console.log('Valid!');
    }
    console.log('---');
});
