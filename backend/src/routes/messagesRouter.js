const express = require("express")
const messageControllers = require("./../controllers/messagesController")
const router = express.Router()

router.post("/api/messages",messageControllers.getAllMessage)
router.post("/messages",messageControllers.sendMessage)

module.exports = router