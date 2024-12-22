import {Entity} from "./entityClass.js";

export class Enemy extends Entity {
    constructor(health = 10, attack = 1, weakness = "") {
        super(health, attack);
        this.weakness = weakness;
    }

        isWeakTo(attackType) {
            return attackType.toLowerCase() === this.weakness.toLowerCase();
        }
    
        takeDamage(amount, attackType = "") {
            if (this.isWeakTo(attackType)) {
                amount *= 2;
            }
            super.takeDamage(amount);
        }
    
        attackPlayer(player) {
            player.takeDamage(this.attack);
            if (player.health <= 0) {
                this.win_condition = true;
            }
        }
    
        checkDeathCondition() {
            if (this.health <= 0) {
                this.lose_condition = true;
            }
            return this.lose_condition;
        }
    
        checkWinCondition(player) {
            if (player.health <= 0) {
                this.win_condition = true;
            }
            return this.win_condition;
        }
    }

