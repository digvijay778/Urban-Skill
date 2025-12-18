const fs = require('fs');
const path = require('path');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require('../config/cloudinary');

const uploadFile = async (file, folder = 'freelance-platform') => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // For files from multer memory storage
    if (file.buffer) {
      // Create temporary file
      const tempDir = path.join(__dirname, '../../uploads/temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFilePath = path.join(
        tempDir,
        `${Date.now()}-${file.originalname}`
      );
      fs.writeFileSync(tempFilePath, file.buffer);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(tempFilePath, folder);

      // Delete temporary file
      fs.unlinkSync(tempFilePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format,
        originalName: file.originalname,
      };
    }

    // For files from disk storage
    const result = await uploadToCloudinary(file.path, folder);

    // Delete local file after upload
    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
      originalName: file.originalname,
    };
  } catch (error) {
    // Clean up temp file if it exists
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

const uploadMultipleFiles = async (files, folder = 'freelance-platform') => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  const uploadPromises = files.map((file) => uploadFile(file, folder));
  const results = await Promise.all(uploadPromises);

  return results;
};

const deleteFile = async (publicId) => {
  if (!publicId) {
    throw new Error('No public ID provided');
  }

  return await deleteFromCloudinary(publicId);
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  uploadToCloudinary,
};
