const dotenv = require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express();

app.listen(process.env.PORT,
    () => console.log(`Listening on port ${process.env.PORT}`))

app.get("/", (req, res) => res.send("Hello World"))

app.get("/api/ping", (req, res) => {
    res.status(200).send({ success: true })
})

const validSortBys = new Set(["id", "reads", "likes", "popularity"])
const validDirections = new Set(["asc", "desc"])

app.get("/api/post", (req, res) => {
    const { tags, sortBy = "id", direction = "asc" } = req.query;
    if (!tags) {
        res.status(400).send({
            error: "Tags parameter is required"
        })
    }
    else if (!validSortBys.has(sortBy)) {
        res.status(400).send({
            error: "sortBy parameter is invalid"
        })
    }
    else if (!validDirections.has(direction)) {
        res.status(400).send({
            error: "direction parameter is invalid"
        })
    } else {
        const resultPromises = tags.split(",")
            .map((tag) => {
                const endpoint = `http://localhost:8080/posts?q=${tag.trim()}`
                console.log(`Request to ${endpoint}`)
                return axios.get(endpoint)
                    .then(({ data }) => data)
            });
        Promise.all(resultPromises)
            .then((tags) => {
                let uniquePosts = {}
                tags.forEach((tagPosts) => {
                    tagPosts.forEach((post) => {
                        uniquePosts[post.id] = post
                    })
                })
                res.send({
                    posts:
                        Object.values(uniquePosts).sort(
                            (a, b) => (direction === "desc" ? (b[sortBy] - a[sortBy]) : (a[sortBy] - b[sortBy])))
                })
            })
            .catch((err) => res.status(400).send(err))
    }

})


