import { v2 as cloudinary } from 'cloudinary';

function getConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };  
}

export async function uploadImage(
  buffer: Buffer,
  folder = 'gatorelite'
): Promise<{ url: string; publicId: string }> {
  cloudinary.config(getConfig());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result!.secure_url, publicId: result!.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  cloudinary.config(getConfig());
  await cloudinary.uploader.destroy(publicId);
}