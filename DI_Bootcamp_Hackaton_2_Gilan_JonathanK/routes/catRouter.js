import { Router } from "express";
import {
    getAllCats,
    getAllWordsInCat,
    addNewCat,
    deleteCat,
}from '../controllers/catControllers.js'

const router = Router();

// get everything form categories
router.get("/", getAllCats)

// get all <category> words
router.get("/:category", getAllWordsInCat )

// add new category
router.post("/", addNewCat)

// delete category
router.delete("/:category", deleteCat)

export const catRouter = router;