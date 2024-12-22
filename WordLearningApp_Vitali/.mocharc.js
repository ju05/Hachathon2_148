"use strict";

module.exports = {
    recursive: true,
    timeout: 30000,
    file: [
        './tests/usersDbTest.js',
        './tests/cardsDbTest.js',
        './tests/hashingTest.js',
        './tests/registrationLoginTest.js',
        './tests/cardsCRUDTest.js'
    ]
}