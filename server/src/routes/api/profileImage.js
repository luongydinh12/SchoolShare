var express = require('express');
var Image = require('../models/image');
var ImageRouter = express.Router();
const multer = require('multer');

const storgae = multer.diskStorage({
    destinatiom: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.origination);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg'|| file.mometyppe === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
constupload = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//storage image and creates a refrence to the filr

ImageRouter.router("/uploadmulter")
  .post(upload.single('imageData'),(req, res, next) => {
      console.log(req.body);
    const newImage = new Image( {
        imageName: req.body.imageName,
        imageData: req.file.path
    });
    newImage.save()
    .then((result) => {
        console.log(result);
        res.status(200).json({
            success: true,
            document: result
        });
    })
    .catch((err) => next(err));
});