module.exports = (sequelize, Sequelize) => {
  const ProductModel = sequelize.define(
    "Products",
    {
      serialNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      inputImageUrls: {
        type: Sequelize.STRING,
      },
      outputImageUrls: {
        type: Sequelize.STRING,
      },
      file_id: {
        type: Sequelize.INTEGER,
      }
    },
    {
      hooks: {
        async beforeCreate(product, options) {
          try {
            //------ before create database logic
            // Retrieve the latest file_id from the database
            const latestProduct = await ProductModel.findOne({
              order: [['file_id', 'DESC']]
            });
            const latestFileId = latestProduct ? latestProduct.file_id : 0;
            product.file_id = latestFileId + 1; // Increment the file_id for the new record
          }
          catch (err) {
            console.log(err);
            throw new Error();
          };
        },
        async beforeUpdate(product, options) {
          try {
            //------ before update database logic
          }
          catch (err) {
            console.log(err);
            throw new Error();
          };
        },
      },
    },
  )

  return ProductModel;
};
