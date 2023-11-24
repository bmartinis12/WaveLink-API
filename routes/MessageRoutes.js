import { Router } from "express";
import multer from 'multer';
import { addAudioMessage, addImageMessage, addMessage, getInitialContactsWithMessages, getMessages } from "../controllers/MessageController.js";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') cb(null, 'uploads/images');
        if (file.fieldname === 'audio') cb(null, 'uploads/recordings');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

const uploadImage = multer({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const uploadAudio = multer({
    destination: function (req, file, cb) {
        cb(null, 'uploads/recordings');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

router.post('/add-message', addMessage);

router.get('/get-messages/:from/:to', getMessages);

router.post('/add-image-message', upload.single('image'), addImageMessage);

router.post('/add-audio-message', upload.single('audio'), addAudioMessage);

router.get('/get-initial-contacts/:from', getInitialContactsWithMessages);

export default router;