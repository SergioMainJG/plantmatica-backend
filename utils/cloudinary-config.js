// utils/cloudinary-config.js

const cloudinary = {
    uploader: {
        upload: async (file, options) => {
            // Evitamos la red y devolvemos la estructura esperada
            return Promise.resolve({
                secure_url: 'https://via.placeholder.com/300',
                public_id: `mock_public_id_${Date.now()}`
            });
        },
        destroy: async (public_id) => {
            return Promise.resolve({ result: 'ok' });
        }
    }
};

module.exports = cloudinary;