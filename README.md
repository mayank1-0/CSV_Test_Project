# Image Processing Application

This is an Express.js application designed to process images based on input CSV files. The application supports asynchronous processing of images, status tracking, and webhook notifications.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Running the Application](#running-the-application)
- [Testing the APIs](#testing-the-apis)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Upload API**: Upload CSV files for image processing and receive a unique request ID.
- **Status API**: Query the status of image processing using the request ID.
- **Webhook Handling**: (Optional) Receive notifications when image processing is complete.
- **Asynchronous Image Processing**: Compress images by 50% of their original quality.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v14 or later)
- MySQL (v5.7 or later)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mayank1-0/CSV_Test_Project.git
   cd CSV_Test_Project

2. **Install Dependencies**

   ```bash
   npm install

3. **Configure the Database**

    Do this by updating the values in .env file according to your connection values

4. **Run the application**

    ```bash
   npm start

5. **Hit the routes as in API Documentation(Swagger)**

    