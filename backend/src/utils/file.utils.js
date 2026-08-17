const fs = require('fs');
const path = require('path');

/**
 * Deletes a local uploaded file safely.
 * Accepts paths such as:
 * /uploads/cars/car-123.jpg
 */
const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') {
    return;
  }

  try {
    // Only delete local uploaded files.
    // External URLs such as Unsplash images will be ignored.
    if (!fileUrl.startsWith('/uploads/')) {
      return;
    }

    const relativePath = fileUrl.replace(/^\/+/, '');

    const filePath = path.join(__dirname, '../../', relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting uploaded file:', error.message);
  }
};

module.exports = {
  deleteUploadedFile
};