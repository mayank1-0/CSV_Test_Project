module.exports = (sequelize, Sequelize) => {
    const FileProcessingModel = sequelize.define(
        "FileProcessing",
        {
            requestID: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                unique: true,
            },
            processingStatus: {
                type: Sequelize.ENUM('Pending', 'Processed', 'Failed'),
                allowNull: false,
                defaultValue: 'Pending'
            }
        },
        {
            hooks: {
                async beforeCreate(user, options) {
                    try {
                        //------ before create database logic
                    }
                    catch (err) {
                        console.log(err);
                        throw new Error();
                    };
                },
                async beforeUpdate(user, options) {
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

    return FileProcessingModel;
};
