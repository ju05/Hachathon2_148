import {categories} from "../config/data.js";

export const getAllCats = (req, res) => {
    res.json(categories);
}

export const getAllWordsInCat = (req, res) => {
    const { category } = req.params

    if (categories[category])//check if category exists
    {
        res.json(categories[category]);
    } else {
        res.status(404).json({ error: "Category not found" })
    }
}

export const addNewCat = (req, res) => {
    const { name, words } = req.body

    if (!name || !Array.isArray(words)) {
        return res.status(400).json({ error: "provide valide category name and array of words" })
    }

    if (categories[name]) {
        return res.status(400).json({ error: "category already exists" })
    }

    categories[name] = words

    res.status(201).json({ message: "category added successfully" , categories})
}

export const deleteCat = (req, res) => {
    const { category } = req.params

    if (categories[category])//check if category exists
    {
        delete categories[category]
        return res.status(200).json({ message: "Category deleted successfully" });
    } else {
        res.status(404).json({ error: "Category not found" })
    }
}

