const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer or base64 string to Cloudinary.
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimeType
 */
exports.uploadToCloudinary = (fileBuffer, originalName, mimeType) => {
  return new Promise((resolve, reject) => {
    const isImage = mimeType && mimeType.startsWith("image/");
    const safeBaseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const publicId = `${Date.now()}_${safeBaseName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "alsm_chat_attachments",
        resource_type: "auto",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload_stream error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: isImage ? "image" : "document",
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports.cloudinary = cloudinary;
