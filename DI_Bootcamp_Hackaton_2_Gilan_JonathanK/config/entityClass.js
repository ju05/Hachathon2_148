export class Entity {
    constructor(health = 10, attack = 1) {
        this.health = Math.max(0, health); // Prevent negative health
        this.attack = Math.max(0, attack); // Prevent negative attack
        this.win_condition = false;
        this.lose_condition = false;
    }

    attackEntity(target) {
        target.takeDamage(this.attack);
    }

    // Method to take damage
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health === 0) {
            this.lose_condition = true;
        }
    }

    healEmtity(target){
        target.healDamage(this.attack)
    }

    healDamage(amount){
        this.health += amount
    }

    checkWin() {
        return this.win_condition;
    }

    checkLose() {
        return this.lose_condition;
    }

}

