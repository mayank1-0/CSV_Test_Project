// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0', // Specify OpenAPI version
  info: {
    title: 'CSV_Test_Project',
    version: '1.0.0',
    description: 'A description of my APIs',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
