const db = require('../db/models/index');
const Products = db.Products;
const FileProcessing = db.FileProcessing;

const checkProcessingStatus = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const result = await FileProcessing.findOne({
            where: { requestID: requestId },
        });

        if (!result) {
            return res.status(500).send('Invalid request id');
        }
        const fileId = result.file_id;
        console.log(`0000 ${fileId}`);

        // Find the request by ID
        const request = await FileProcessing.findOne({
            where: { file_id: fileId },
            include: [Products]  // Include related products if needed
        });

        // Check if the request exists
        if (!request) {
            return res.status(404).json({ message: 'File id associated with request id not found' });
        }

        console.log(`11111 ${fileId}`);

        // Retrieve request status and optionally output CSV URL
        const response = {
            requestId: request.requestID,
            status: request.processingStatus,
            inputFileId: fileId,
            // outputCsvUrl: request.output_csv_url,
            products: request.Products.map(product => ({
                serialNumber: product.serialNumber,
                productName: product.productName,
                inputImageUrls: product.inputImageUrls,
                outputImageUrls: product.outputImageUrls
            }))
        };

        // Send response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving request status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    checkProcessingStatus
}