const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('../db/models/index');
const Products = db.Products;
const FileProcessing = db.FileProcessing;

const uploadProductCSV = async (req, res) => {
    try {
        // if no file selected to upload
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Variable to store the file_id for this upload
        let fileId;
        let responseSent = false;

        // Store initial processing status in the FileProcessing table
        const newRecord = await FileProcessing.create({
            processingStatus: 'Pending'
        });

        const requestID = newRecord.requestID;

        // a variable for checking if CSV data is successfully uploaded to database
        const headers = [];
        const promises = [];
        let productDataSave;

        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('headers', (headerList) => {
                headers.push(...headerList);
            })
            .on('data', async (row) => {
                try {
                    let productData = {};

                    // Handle rows with extra columns
                    const rowValues = Object.values(row);

                    // Handling extra values, if any by saving them as a single string
                    if (rowValues.length > headers.length) {
                        let lastRow = ''
                        // handling extra values starting from 3rd position to end by converting them into a comma-seperated single string
                        for (let i = 2; i < rowValues.length; i++) {
                            if (i != (rowValues.length - 1)) {
                                lastRow += rowValues[i] + ',';
                            }
                            else {
                                lastRow += rowValues[i];
                            }
                        }
                        // storing respective values in a object
                        productData.serialNumber = rowValues[0];
                        productData.productName = rowValues[1];
                        productData.inputImageUrls = lastRow;
                        // productDataSave = await Products.create(productData);
                    } else {
                        productData.serialNumber = rowValues[0];
                        productData.productName = rowValues[1];
                        productData.inputImageUrls = rowValues[2];
                        // productDataSave = await Products.create(productData);
                    }
                    productData.fileId = fileId; // Will be set in the beforeCreate hook

                    // Collect all promises for creating products
                    promises.push(Products.create(productData));

                } catch (err) {
                    console.error('Error processing row:', err);
                    if (!responseSent) {
                        res.status(500).send('Error processing CSV row.');
                        responseSent = true;
                    }
                }
            })
            .on('end', async () => {
                try {

                    // Wait for all products to be created
                    await Promise.all(promises);

                    if (!responseSent) {
                        res.send({
                            status: 200,
                            message: "Product data saved successfully",
                            data: { requestID }
                        });
                        responseSent = true;
                    }
                } catch (error) {
                    console.error('Error processing CSV data:', error);
                    if (!responseSent) {
                        res.status(500).send('Error processing CSV data.');
                        responseSent = true;
                    }
                } finally {
                    // Clean up uploaded file
                    fs.unlinkSync(req.file.path);
                }
            });
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