const db = require('../db/models/index'); // Adjust the path as needed
const Products = db.Products;

/**
 * Stores parsed product data in the database.
 * @param {Object[]} productDataArray - Array of product data objects.
 * @param {number} fileId - File ID from the FileProcessing record.
 * @returns {Promise<void>}
 */
const storeProductData = async (productDataArray, fileId) => {
    try {
        const promises = productDataArray.map(async (productData) => {
            productData.file_id = fileId; // Attach the fileId to each record
            const result = await Products.findOne({
                where: {
                    productName: productData.productName
                }
            })
            if (!result) {
                return Products.create(productData);
            }
            else {
                return Products.update({
                    outputImageUrls: productData.outputImageUrls
                }, {
                    where: {
                        productName: productData.productName
                    }
                });
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Error storing product data:', error);
        throw error;
    }
};

module.exports = { storeProductData };
