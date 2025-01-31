const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const db = require('../db/models/index');
const Products = db.Products;
const FileProcessing = db.FileProcessing;
const { parseCSV } = require('../utils/csvUtils');
const { processImage } = require('../services/imageProcessor');
const { storeProductData } = require('../services/productService');
const { sendWebhookNotification } = require('../services/webhookService');


// const uploadProductCSV1 = async (req, res) => {
//     try {
//         // if no file selected to upload
//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         // Variable to store the file_id for this upload
//         let fileId;
//         let responseSent = false;

//         // Store initial processing status in the FileProcessing table
//         const newRecord = await FileProcessing.create({
//             processingStatus: 'Pending'
//         });

//         const requestID = newRecord.requestID;

//         // a variable for checking if CSV data is successfully uploaded to database
//         const headers = [];
//         const promises = [];
//         let productDataSave;

//         fs.createReadStream(req.file.path)
//             .pipe(csvParser())
//             .on('headers', (headerList) => {
//                 headers.push(...headerList);
//             })
//             .on('data', async (row) => {
//                 try {
//                     let productData = {};

//                     // Handle rows with extra columns
//                     const rowValues = Object.values(row);

//                     // Handling extra values, if any by saving them as a single string
//                     if (rowValues.length > headers.length) {
//                         let lastRow = ''
//                         // handling extra values starting from 3rd position to end by converting them into a comma-seperated single string
//                         for (let i = 2; i < rowValues.length; i++) {
//                             if (i != (rowValues.length - 1)) {
//                                 lastRow += rowValues[i] + ',';
//                             }
//                             else {
//                                 lastRow += rowValues[i];
//                             }
//                         }
//                         // storing respective values in a object
//                         productData.serialNumber = rowValues[0];
//                         productData.productName = rowValues[1];
//                         productData.inputImageUrls = lastRow;
//                         // productDataSave = await Products.create(productData);
//                     } else {
//                         productData.serialNumber = rowValues[0];
//                         productData.productName = rowValues[1];
//                         productData.inputImageUrls = rowValues[2];
//                         // productDataSave = await Products.create(productData);
//                     }
//                     productData.fileId = fileId; // Will be set in the beforeCreate hook

//                     // Collect all promises for creating products
//                     promises.push(Products.create(productData));

//                 } catch (err) {
//                     console.error('Error processing row:', err);
//                     if (!responseSent) {
//                         res.status(500).send('Error processing CSV row.');
//                         responseSent = true;
//                     }
//                 }
//             })
//             .on('end', async () => {
//                 try {

//                     // Wait for all products to be created
//                     await Promise.all(promises);

//                     if (!responseSent) {
//                         res.send({
//                             status: 200,
//                             message: "Product data saved successfully",
//                             data: { requestID }
//                         });
//                         responseSent = true;
//                     }
//                 } catch (error) {
//                     console.error('Error processing CSV data:', error);
//                     if (!responseSent) {
//                         res.status(500).send('Error processing CSV data.');
//                         responseSent = true;
//                     }
//                 } finally {
//                     // Clean up uploaded file
//                     fs.unlinkSync(req.file.path);
//                 }
//             });
//     } catch (error) {
//         console.error('Error handling CSV file upload:', error);
//         if (!responseSent) {
//             res.status(500).send('Error handling CSV file upload');
//             responseSent = true;
//         }
//     }
// }

const uploadProductCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const newRecord = await FileProcessing.create({
            processingStatus: 'Pending'
        });

        const fileId = newRecord.file_id;
        const requestID = newRecord.requestID;
        let responseSent = false;

        const productDataArray = await parseCSV(req.file.path);         // Parses a CSV file and returns the data as an array of objects.

        await storeProductData(productDataArray, fileId);           // Stores parsed product data in the database.
        // Process each image
        const outputDir = path.join(__dirname, '../processedImages');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const updatedProductDataArray = await Promise.all(
            productDataArray.map(async (productData) => {
                let outputUrl = [];
                const inputImageUrls = productData.inputImageUrls.split(',');
                const outputImageUrls = await Promise.all(
                    inputImageUrls.map(async (imageUrl) => {
                        outputUrlValue = await processImage(imageUrl, outputDir)
                        outputUrl.push(outputUrlValue);
                    })
                );
                return {
                    ...productData,
                    outputImageUrls: outputUrl.join(',')
                };
            })
        );

        // Store the processed data into the database
        await storeProductData(updatedProductDataArray, fileId);
        const webhookUrl = 'https://your-webhook-url.com/notify';
        const webhookData = {
            requestID,
            processingStatus: 'Completed',
            processedImageUrls: updatedProductDataArray.map(product => product.outputImageUrls)
        };
        // Send webhook notification
        await sendWebhookNotification(webhookUrl, webhookData);
        if (!responseSent) {
            res.send({
                status: 200,
                message: "Product data processed and saved successfully",
                data: { requestID }
            });
            responseSent = true;
        }
        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error('Error handling CSV file upload:', error);
        if (!responseSent) {
            res.status(500).send('Error handling CSV file upload');
            responseSent = true;
        }
    }
}

module.exports = {
    uploadProductCSV
}