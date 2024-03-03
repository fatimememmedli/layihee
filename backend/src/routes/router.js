const express = require("express")
const Controllers = require("./../controllers/controllers")
const router = express.Router()
// const userAuth = require("./../middlewares/userAuthMidd")

// Get all posts
router.post("/users",Controllers.postUser)
router.get("/users/:id",Controllers.getUserById)
router.delete("/users/:id",Controllers.deleteUser)
router.patch("/users/:id",Controllers.patchUser)
router.put("/users/:id",Controllers.putUser)
router.post("/login",Controllers.login)
router.get("/users", Controllers.getAllUser)

module.exports = router