import { Router } from "express";
import multer from 'multer';
import { addAudioMessage, addImageMessage, addMessage, getInitialContactsWithMessages, getMessages } from "../controllers/MessageController.js";

const router = Router();

const uploadImage = multer({ dest: 'uploads/images' });
const uploadAudio = multer({ dest: 'uploads/recordings' });

router.post('/add-message', addMessage);

router.get('/get-messages/:from/:to', getMessages);

router.post('/add-image-message', uploadImage.single('image'), addImageMessage);

router.post('/add-audio-message', uploadAudio.single('audio'), addAudioMessage);

router.get('/get-initial-contacts/:from', getInitialContactsWithMessages);

export default router;