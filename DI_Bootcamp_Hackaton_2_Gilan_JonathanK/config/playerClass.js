import {Entity} from "./entityClass.js";

export class Player extends Entity {
    constructor(health = 10, attack = 1, score = 0){
        super(health, attack);
        this.score = score; 
    }

    increaseScore(points) {
        this.score += points;
    }

    checkWinCondition() {
        if (this.score >= 10) {
            this.win_condition = true;
        }
        return this.win_condition;
    }

    checkDeathCondition() {
        if (this.health <= 0) {
            this.lose_condition = true;
        }
        return this.lose_condition;
    }

}

