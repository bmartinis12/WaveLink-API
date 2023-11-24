import { Router } from "express";
import multer from 'multer';
import { addAudioMessage, addImageMessage, addMessage, getInitialContactsWithMessages, getMessages } from "../controllers/MessageController.js";

const router = Router();

const uploadImage = multer({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadAudio = multer({
    destination: function (req, file, cb) {
        cb(null, 'uploads/recordings');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

router.post('/add-message', addMessage);

router.get('/get-messages/:from/:to', getMessages);

router.post('/add-image-message', uploadImage.single('image'), addImageMessage);

router.post('/add-audio-message', uploadAudio.single('audio'), addAudioMessage);

router.get('/get-initial-contacts/:from', getInitialContactsWithMessages);

export default router;