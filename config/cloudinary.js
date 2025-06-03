const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage for uploaded files
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'chat-app',
    allowedFormats: ['jpg', 'jpeg', 'png'],
    public_id: 'profile-' + Date.now(),
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }),
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };