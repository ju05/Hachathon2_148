const {db} = require ('../config/data.js')

const getRecipesDB = () => {
    return db('recipes')
    .select('recipe_id', 'username', 'title', 'description', 'is_vegan', 'picture_url ', 'ingredients')
}

const getRecipesByUsernameDB = (username) => {
    return db('recipes')
    .select ('recipe_id', 'username', 'title', 'description', 'is_vegan', 'picture_url ', 'ingredients')
    .where ({username})
}

const getRecipeByIDDB = (id) => {
    return db('recipes')
    .select('recipe_id', 'username', 'title', 'description', 'is_vegan', 'picture_url ', 'ingredients')
    .where({recipe_id : id})
}

const postRecipeDB = (recipe) => {
    const {username, title, description, is_vegan, picture_url, ingredients } = recipe

    return db('recipes').insert(
        {
            username,
            title,
            description: JSON.stringify(description), // Convert array to JSON string
            is_vegan,
            picture_url,
            ingredients: JSON.stringify(ingredients), // Convert array to JSON string
        },
        ['recipe_id', 'username', 'title', 'description', 'is_vegan', 'picture_url', 'ingredients']
    );

}

const updateRecipeDB = (recipe) => {
    const {recipe_id, title, description, is_vegan, picture_url, ingredients } = recipe

    return db('recipes')
    .update(
        {
            title, 
            description : JSON.stringify(description),
            is_vegan,
            picture_url, 
            ingredients : JSON.stringify(ingredients)
        }, 
            ['recipe_id', 'username', 'title', 'description', 'is_vegan', 'picture_url ', 'ingredients'])
    .where({recipe_id})

}

const deleteRecipeDB = (id) => {
    return db('recipes')
    .del()
    .where({recipe_id: id})
    .returning('*')
}

const getAllCategoriesDB = () => {
    return db('categories')
    .select('category_id' , 'name')
}

const getCategoriesByRecipeDB = (id) => {
    return db('recipe_categories as rc')
    .join('categories as c', 'rc.category_id', 'c.category_id') 
    .select('c.category_id', 'c.name') 
    .where('rc.recipe_id', id); 
}

const getRecipesCategoriesDB = () => {
    return db('recipe_categories')
    .select('recipe_id', 'category_id')
}

module.exports = {getRecipesDB,
                getRecipesByUsernameDB,
                getRecipeByIDDB,
                postRecipeDB,
                updateRecipeDB,
                deleteRecipeDB,
                getAllCategoriesDB,
                getCategoriesByRecipeDB,
                getRecipesCategoriesDB
}