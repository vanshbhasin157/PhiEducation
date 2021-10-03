
const contactMe = (sequelize, Sequelize) => {
    const contactMe = sequelize.define("contactMe", {
        fullName: {
            type: Sequelize.STRING
        },
        mobileNumber: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        message:{
            type: Sequelize.TEXT
        }
    }, {
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
    });

    return contactMe;
};

module.exports = {
    contactMe
}