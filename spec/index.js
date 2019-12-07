const axios = require('axios');
const assert = require('assert');
const dotenv = require('dotenv').config();

describe("Blog Server", () => {
    describe("Route 1: /api/ping", () => {
        it("Should return the correct body", () => {
            const expected = {
                data: { "success": true }
            }
            axios.get(`http://localhost:${process.env.PORT}/api/ping`)
                .then(({ status, data }) => { assert.equal(data.success, expected.data.success) })
        })
        it("Should return the correct status", () => {
            const expected = { status: 200 }
            axios.get(`http://localhost:${process.env.PORT}/api/ping`)
                .then(({ status, data }) => assert.equal(status, expected.status))
        })
    })
    describe("Route 2: /api/post", () => {
        it("Should return status 400 when `tags` aren't present", () => {
            const expected = { status: 400 }
            axios.get(`http://localhost:${process.env.PORT}/api/post?sortBy=likes&direction=desc`)
                .catch(({ response }) => assert.equal(response.status, expected.status))

        })
        it("Should return error message if `tags` parameter is not present", () => {
            const expected = {
                data: { "error": "Tags parameter is required" }
            }
            axios.get(`http://localhost:${process.env.PORT}/api/post?sortBy=likes&direction=desc`)
                .catch(({ response }) => assert.equal(response.data.error, expected.data.error))
        })
        it("Should return error message if `sortBy` or `direction` are invalid values", () => {
            const expected = {
                data: { "error": "sortBy parameter is invalid" }
            }
            axios.get(`http://localhost:${process.env.PORT}/api/post?tags=history,tech&sortBy=height&direction=desc`)
                .catch(({ response }) => assert.equal(response.data.error, expected.data.error))
        })
        it("Should return status 200 for successful requests", () => {
            const expected = { status: 200 }
            axios.get(`http://localhost:${process.env.PORT}/api/post?tags=history,tech&sortBy=likes&direction=desc`)
                .then(({ status }) => assert.equal(status, expected.status))
        })
        it("Response should not contain any repeats", () => {
            axios.get(`http://localhost:${process.env.PORT}/api/post?tags=history,tech`)
                .then(({ data }) => {
                    let idCounts = {}
                    data.posts.forEach((post) => {
                        if (idCounts[post.id]) {
                            idCounts[post.id]++;
                        } else {
                            idCounts[post.id] = 1;
                        }
                    })
                    assert.equal(
                        Object.values(idCounts).every((count) => count === 1),
                        true)
                })
        })
        it("Each post should have at least one of the `tags` queried", () => {
            axios.get(`http://localhost:${process.env.PORT}/api/post?tags=history,tech`)
                .then(({ data }) => {
                    assert.equal(
                        data.posts.every(
                            (post) =>
                                post.tags.includes("history") || post.tags.includes("tech")),
                        true)
                })
        })
        it("Posts should be sorted by `sortBy` parameter", () => {
            axios.get(`http://localhost:${process.env.PORT}/api/post?tags=history,tech&sortBy=likes`)
                .then(({ data }) => {
                    assert.equal(
                        data.posts.every(
                            (post, i, arr) => !(i > 1 && arr[i - 1].likes > post.likes)),
                        true)
                })
        })
        it("Posts should be able to be sorted in descending order", () => {
            axios.get(`http://localhost:${process.env.PORT}/api/post?tags=history,tech&sortBy=likes&direction=desc`)
                .then(({ data }) => {
                    assert.equal(
                        data.posts.every(
                            (post, i, arr) => !(i > 1 && arr[i - 1].likes < post.likes)),
                        true)
                })
        })
    })
})
