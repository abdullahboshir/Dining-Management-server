const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: 'postImages/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '_' + file.originalname)
    }
});

const uploader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const supportedImage = /jpg|png|jpeg/;
        const extension = path.extname(file.originalname);
        if(supportedImage.test(extension)){
            cb(null, true);
        }
        else{
            cb(new Error('image must be a png/jpg'))
        }
    },
    limits: {
        fileSize: 5000000
    }
});


module.exports = uploader;
