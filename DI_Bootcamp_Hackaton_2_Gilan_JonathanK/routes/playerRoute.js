import express from "express";
const router = express.Router();
import playerController from "../controllers/playerController.js";
// const playerController= new PlayerController();

router.get("/", (req,res) => {
    try {
        const players = playerController.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/create", (req, res) => {
    const { name, health, attack, score } = req.body;
    try {
        const player = playerController.createNewPlayer(name, health, attack, score);
        res.status(201).json({ message: "Player created successfully", player });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:name", (req, res) => {
    const { name } = req.params;
    try {
        const player = playerController.findPlayerByName(name);
        res.status(200).json(player);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.patch("/:name/score", (req, res) => {
    const { name } = req.params;
    const { points } = req.body;
    try {
        const player = playerController.addScoretoPlayer(name, points);
        res.status(200).json({ message: "Score updated", player });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.patch("/:name/damage", (req, res) => {
    const { name } = req.params;
    const { amount } = req.body;
    try {
        const player = playerController.damagePlayer(name, amount);
        res.status(200).json({ message: "Player damaged", player });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.patch("/:name/heal", (req, res) => {
    const { name } = req.params;
    const { amount } = req.body;
    try {
        const player = playerController.healPlayer(name, amount);
        res.status(200).json({ message: "Player healed", player });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get("/:name/win", (req, res) => {
    const { name } = req.params;
    try {
        const winCondition = playerController.checkWin(name);
        res.status(200).json({ win: winCondition });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:name/death", (req, res) => {
    const { name } = req.params;
    try {
        const deathCondition = playerController.checkDeath(name);
        res.status(200).json({ death: deathCondition });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch("/:name/restart", (req, res) => {
    const { name } = req.params;
    try {
        const player = playerController.restartPlayer(name);
        res.status(200).json({ message: "Player reset successfully", player });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


module.exports = router;
