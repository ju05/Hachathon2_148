import express from "express";
const router = express.Router();
import enemyController from "../controllers/enemyController.js";
import playerController from "../controllers/playerController.js";

router.post("/create", (req, res) => {
    const { name, health, attack, weakness } = req.body;
    try {
        const enemy = enemyController.createEnemy(name, health, attack, weakness);
        res.status(201).json({ message: "Enemy created successfully", enemy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/generate", (req, res) => {
    const { count } = req.body;  // Optional: count can be specified in the request body
    try {
        const enemies = enemyController.createMultipleEnemies(count || 10); // Default to 10 enemies if no count is provided
        res.status(201).json({ message: `${enemies.length} enemies created successfully`, enemies });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:name", (req, res) => {
    const { name } = req.params;
    try {
        const enemy = enemyController.findEnemyByName(name);
        res.status(200).json(enemy);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.patch("/:name/damage", (req, res) => {
    const { word } = req.body;
    try {
        const enemy = enemyController.damageEnemyWithWord(req.params.name, word);
        res.status(200).json({ message: "Enemy damaged", enemy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch("/:name/heal", (req, res) => {
    const { amount } = req.body;
    try {
        const enemy = enemyController.healEnemy(req.params.name, amount);
        res.status(200).json({ message: "Enemy healed", enemy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/:name/attack", (req, res) => {
    const { playerName } = req.body;

    try {
        // Validate player
        const player = playerController.findPlayerByName(playerName);
        if (!player) {
            throw new Error(`Player ${playerName} not found.`);
        }

        // Perform enemy attack
        const result = enemyController.enemyAttackPlayer(req.params.name, player);
        res.status(200).json({ message: "Enemy attacked player", result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get("/:name/death", (req, res) => {
    try {
        const isDead = enemyController.checkEnemyDeath(req.params.name);
        res.status(200).json({ isDead });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get("/:name/win", (req, res) => {
    const { playerName } = req.query;
    try {
        const player = playerController.findPlayerByName(playerName);
        const didWin = enemyController.checkEnemyWin(req.params.name, player);
        res.status(200).json({ didWin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", (req, res) => {
    try {
        const enemies = enemyController.getAllEnemies();
        res.status(200).json(enemies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:name", (req, res) => {
    try {
        const enemy = enemyController.removeEnemy(req.params.name);
        res.status(200).json({ message: "Enemy removed", enemy });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;