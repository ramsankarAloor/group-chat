const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { postMessage, getMessages } = require("../controllers/chat");

router.post("/message", authenticate, postMessage);
router.get("/get-messages", authenticate, getMessages);

const multer = require("multer");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: "us-east-1", // Replace with your AWS region
});

const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() }); // stored in ram
router.post(
  "/upload",
  authenticate,
  upload.single("uploaded_file"),
  async function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file.buffer, req.body);

    try {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ACL: 'public-read'
      };
      const uploadedFile = await s3.upload(params).promise();
      const fileUrl = uploadedFile.Location;

      res.status(200).json({ url: fileUrl });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

module.exports = router;
