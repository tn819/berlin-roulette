const bcrypt = require("bcryptjs");
const passwordValidator = require("password-validator");
const validator = require("validator");

// Create a schema
const schema = new passwordValidator();

// 8-16 characters, no spaces
schema
    .is()
    .min(6)
    .is()
    .max(12)
    .has()
    .not()
    .spaces();

const validatePassword = plainTextPassword => {
    return new Promise((resolve, reject) => {
        if (schema.validate(plainTextPassword)) {
            resolve(plainTextPassword);
        } else {
            reject("Please enter a valid password with 6-12 characters");
        }
    });
};

module.exports.checkValidRegistration = (
    firstname,
    lastname,
    email,
    password
) => {
    return new Promise((resolve, reject) => {
        let updatedInputs = {};
        updatedInputs.firstname = firstname.trim();
        updatedInputs.lastname = lastname.trim();
        updatedInputs.email = email.trim();
        if (
            validator.isEmpty(updatedInputs.firstname) ||
            validator.isEmpty(updatedInputs.lastname)
        ) {
            reject("Please enter a valid full name");
        } else if (!validator.isEmail(updatedInputs.email)) {
            reject("Please enter a valid email");
        } else {
            password = password.trim();
            validatePassword(password)
                .then(result => {
                    return bcrypt.hash(result, 10);
                })
                .then(hashedPassword => {
                    updatedInputs.password = hashedPassword;
                    console.log(updatedInputs, hashedPassword);
                    resolve(updatedInputs);
                })
                .catch(err => {
                    reject(`Please enter a valid password (${err})`);
                });
        }
    });
};
