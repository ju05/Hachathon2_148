const Enemy = require("../config/enemyClass");
const { checkWord } = require("../utils/wordChecker");
const generateEnemies = require("../utils/enemyGenerator");

 class EnemyController {
    constructor() {
        this.enemies = {};
    }

    createEnemy(name, health = 10, attack = 1, weakness = "") {
        if (this.enemies[name]) {
            throw new Error("Enemy with this name already exists.");
        }
        const enemy = new Enemy(health, attack, weakness);
        this.enemies[name] = enemy;
        return enemy;
    }

    createMultipleEnemies(count = 10) {
        const generatedEnemies = generateEnemies(count); // Generate an array of random enemies

        // Add each generated enemy to the enemies collection
        generatedEnemies.forEach(enemyData => {
            const { name, health, attack, weakness, image } = enemyData;
            if (!this.enemies[name]) {  // Ensure no duplicate names
                const enemy = new Enemy(health, attack, weakness);
                enemy.image = image; // Add image to the enemy
                this.enemies[name] = enemy;
            }
        });

        return generatedEnemies;
    }

    findEnemyByName(name) {
        const enemy = this.enemies[name];
        if (!enemy) {
            throw new Error("Enemy not found.");
        }
        return enemy;
    }

    damageEnemyWithWord(name, word) {
        const enemy = this.findEnemyByName(name);
        const { damage, isValidWord, category } = checkWord(word);

        if (isValidWord) {
            if (category === enemy.weakness) {
                enemy.takeDamage(damage * 2, category); // Apply double damage for weakness
            } else {
                enemy.takeDamage(damage, category); // Apply normal damage
            }
        } else {
            enemy.healDamage(damage); // Heal enemy for invalid word
        }

        return { enemy, damage, isValidWord, category };
    }

    healEnemy(name, amount) {
        const enemy = this.findEnemyByName(name);
        enemy.healDamage(amount);
        return enemy;
    }

    enemyAttackPlayer(name, player) {
        const enemy = this.findEnemyByName(name);
        if (!enemy) {
            throw new Error(`Enemy ${name} not found.`);
        }

        // Perform attack
        enemy.attackPlayer(player);

        // Return enemy and updated player state
        return { enemy, player };
    }

    checkEnemyDeath(name) {
        const enemy = this.findEnemyByName(name);
        return enemy.checkDeathCondition();
    }

    checkEnemyWin(name, player) {
        const enemy = this.findEnemyByName(name);
        return enemy.checkWinCondition(player);
    }

    getAllEnemies() {
        return Object.entries(this.enemies).map(([name, attributes]) => ({ name, attributes }));
    }

    removeEnemy(name) {
        const enemy = this.findEnemyByName(name);
        delete this.enemies[name];
        return enemy;
    }
}

export default new EnemyController();
