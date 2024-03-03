const MessageModel = require("./../model/messageModel");

const sendMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = new MessageModel({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    await data.save();

    return res.json({ msg: "Message added successfully." });
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllMessage = async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await MessageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg)=> {
      return {
        fromSelf:msg.sender.toString()===from,
        message:msg.message.text,
      }
    })
    res.json(projectMessages)
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getAllMessage,
};
