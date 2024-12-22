const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

const cors = require ('cors');
const postgres = require('postgres');
require('dotenv').config();

app.use(cors());
// Setting the static files in public to display through the server
app.use('/', express.static(__dirname+'/public'));

// Quickly change port for when running the server
const port = 3105;

// Setting up EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.listen(port, () => {
    console.log(`Run on port ${port}`)
})

// Importing database details from the .env file
const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD
} = process.env;

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: PGHOST,
        port: 5432,
        user: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        ssl: { rejectUnauthorized: false },
    },
});

// Uses KNEX to query db and fetch all items from `posts` table
async function viewBlogTable() {
    try {
        const blogs = await knex.select('*').from('posts');
        return blogs;
    } catch (error) {
        console.error('Error fetching blog table:', error);
        throw error
    }
}

viewBlogTable();

// Displays the fetched posts as fetchable api
app.get('/post-data', async (req, res) => {
    try {
        const blogPosts = await viewBlogTable();
        res.json(blogPosts);
    } catch (error) {
        console.error('Error in /post-data route:', error);
        res.status(500).json({ error: 'Failed to fetch blog table' });
    }
});

// Dynamic id parameter to create the page for a post and load correct details by id
app.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Query for the specific post using id in param
        const post = await knex('posts').where({ id }).first();
        
        if (!post) {
            // Display 404 notice if no post with that id
            return res.status(404).send('Post not found');
        }
        // Render the post data using the EJS template in views/post.ejs
        res.render('post', { post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Error fetching the post');
    }
});

// Route to handle post requests for new post submissions
app.post('/submit-post', async (req, res) => {
    // Extracting the relevant data from the request body
    const { title, publish_date, author, cover_image, content, } = req.body;

    // Insert the data into databse using KNEX query (with error handling)
    try {
        const result = await knex('posts').insert({
            title: title,
            publish_date: publish_date,
            author: author,
            cover_image: cover_image,
            content: content
        });
        res.status(201).json({ message: 'Post created successfully!', postId: result[0] });
    } catch (error) {
        console.error('Error inserting post into database:', error);
        res.status(500).json({ message: 'An error occurred while creating the post.' });
    }
});
