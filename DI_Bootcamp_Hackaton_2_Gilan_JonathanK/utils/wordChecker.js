import { categories } from "../config/data.js";

function checkWord(word) {
    word = word.toLowerCase(); // Convert the input word to lowercase
    
    for (const category in categories) {
        const categoryWords = categories[category];
        
        if (Array.isArray(categoryWords)) {
            if (categoryWords.some(w => w.toLowerCase() === word)) {
                const wordLength = word.length;
                const damage = calculateDamage(wordLength);
                return { damage, isValidWord: true, category };
            }
        } else if (typeof categoryWords === 'object') {
            const keys = Object.keys(categoryWords);
            if (keys.some(k => k.toLowerCase() === word)) {
                const wordLength = word.length;
                const damage = calculateDamage(wordLength);
                return { damage, isValidWord: true, category };
            }
        }
    }

    // If the word wasn't found in any category
    const wordLength = word.length;
    const damage = calculateDamage(wordLength);
    return { damage, isValidWord: false };
}

function calculateDamage(wordLength) {
    if (wordLength >= 3 && wordLength <= 5) return 1;
    if (wordLength >= 6 && wordLength <= 8) return 2;
    if (wordLength > 8) return 3;
    return 0;
}



// console.log(checkWord("French fries"))
// console.log(checkWord("Cum toast"))
