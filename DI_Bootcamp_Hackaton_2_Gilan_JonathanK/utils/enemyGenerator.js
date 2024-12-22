const { categories } = require('../config/data.js');

// Function to generate a random 3-string sequence
const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Function to generate a random enemy image URL
const generateRandomImage = () => {
    const randomString = `${generateRandomString()}${generateRandomString()}${generateRandomString()}`;
    return `https://robohash.org/${randomString}.png?set=set2&size=150x150`;
};

// Function to generate a random weakness category from the categories object
const getRandomCategory = () => {
    const categoryKeys = Object.keys(categories); // Get the keys of the categories object
    const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    return randomCategoryKey; // Return the name of the category (weakness)
};

// Function to generate a random enemy
const generateRandomEnemy = () => {
    const names = ["Jorge", "NotJorge", "Matt", "AnotherMatt", "Griffith", "Guts", "Gintoki", "Steve", "Gon", "Killua"];
    
    // Randomly select values for each enemy property
    const name = names[Math.floor(Math.random() * names.length)];
    const image = generateRandomImage(); // Generate a unique image using random strings
    const attack = Math.floor(Math.random() * 5) + 1; // Attack between 1 and 6
    const health = Math.floor(Math.random() * 50) + 10; // Health between 10 and 60
    
    // Select a random weakness category from the categories object
    const weakness = getRandomCategory(); // This will return the name of the category (e.g., "Food", "Sports")

    return {
        name,
        image,
        attack,
        health,
        weakness
    };
};

// Function to generate multiple random enemies
const generateEnemies = (count = 10) => {
    let enemies = [];
    for (let i = 0; i < count; i++) {
        enemies.push(generateRandomEnemy());
    }
    return enemies;
};

module.exports = generateEnemies;