// middleware/multer.js
import multer from 'multer';

const storage = multer.memoryStorage(); // keep in memory (no disk writes)
const upload = multer({ storage });

export default upload;
