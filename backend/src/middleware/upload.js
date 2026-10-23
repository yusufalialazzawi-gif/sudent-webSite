import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure storage directories exist
const publicUploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
const privateUploadDir = path.resolve(process.env.PRIVATE_DOCS_DIR || './storage/private_documents');

if (!fs.existsSync(publicUploadDir)) {
  fs.mkdirSync(publicUploadDir, { recursive: true });
}
if (!fs.existsSync(privateUploadDir)) {
  fs.mkdirSync(privateUploadDir, { recursive: true });
}

// 1. Public Media Upload (Images, Logos)
const publicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

const publicFileFilter = (req, file, cb) => {
  const allowedMime = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
  ];
  if (allowedMime.includes(file.mimetype) || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, SVG, PDF, and Videos (MP4, WebM, OGG, MOV) are allowed.'), false);
  }
};

export const publicUpload = multer({
  storage: publicStorage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB limit
  fileFilter: publicFileFilter,
});

// 2. Dedicated University Video Upload (MP4, WebM, MOV, OGG)
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    cb(null, `uni-video-${uniqueSuffix}${ext}`);
  },
});

const videoFileFilter = (req, file, cb) => {
  const allowedMime = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/mpeg',
  ];
  if (allowedMime.includes(file.mimetype) || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Yalnızca geçerli video dosyaları (MP4, WebM, MOV, OGG) yüklenebilir.'), false);
  }
};

export const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB limit
  fileFilter: videoFileFilter,
});

// 2. Private Student Documents Upload (Passports, Transcripts, Diplomas)
const privateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, privateUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

const privateFileFilter = (req, file, cb) => {
  const allowedMime = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid document format. Only PDF, JPG, PNG, and DOCX are permitted.'), false);
  }
};

export const privateDocumentUpload = multer({
  storage: privateStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: privateFileFilter,
});

export const getPrivateDocPath = (filename) => {
  return path.join(privateUploadDir, filename);
};
