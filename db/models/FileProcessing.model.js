module.exports = (sequelize, Sequelize) => {
    const FileProcessingModel = sequelize.define(
        "FileProcessing",
        {
            requestID: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            processingStatus: {
                type: Sequelize.ENUM('Pending', 'Processed', 'Failed'),
                allowNull: false,
                defaultValue: 'Pending'
            },
            file_id: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            }
        },
        {
            hooks: {
                async beforeCreate(fileProcessing, options) {
                    try {
                        //------ before create database logic
                        // Retrieve the latest file_id from the database
                        const latestProcessingFile = await FileProcessingModel.findOne({
                            order: [['file_id', 'DESC']]
                        });
                        const latestProcessingFileId = latestProcessingFile ? latestProcessingFile.file_id : 0;
                        fileProcessing.file_id = latestProcessingFileId + 1; // Increment the file_id for the new record
                    }
                    catch (err) {
                        console.log(err);
                        throw new Error();
                    };
                },
                async beforeUpdate(fileProcessing, options) {
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
