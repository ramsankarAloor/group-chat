const Messages = require("../models/messages");

exports.postMessage = async (req, res) => {
    try {
        const message = req.body.message;

        const newMessage = await Messages.create({
          message,
          userId: req.user.id,
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({err : "error in posting message"})
    }
 
};
