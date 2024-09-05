const fs = require('fs');
const csvParser = require('csv-parser');

/**
 * Parses a CSV file and returns the data as an array of objects.
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Object[]>} - Promise resolving to an array of row objects.
 */
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const headers = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('headers', (headerList) => {
                headers.push(...headerList);
            })
            .on('data', (row) => {
                const rowValues = Object.values(row);
                let productData = {};

                if (rowValues.length > headers.length) {
                    let lastRow = '';
                    for (let i = 2; i < rowValues.length; i++) {
                        lastRow += (i !== rowValues.length - 1 ? rowValues[i] + ',' : rowValues[i]);
                    }
                    productData = {
                        serialNumber: parseInt(rowValues[0], 10),
                        productName: rowValues[1],
                        inputImageUrls: lastRow
                    };
                } else {
                    productData = {
                        serialNumber: parseInt(rowValues[0], 10),
                        productName: rowValues[1],
                        inputImageUrls: rowValues[2]
                    };
                }

                results.push(productData);
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

module.exports = { parseCSV };
