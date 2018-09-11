
const levelDB = require('../levelDB_module')('validationdata');



exports.IdentityValidator = function (endPoint, walletAddress) {

    new Promise((resolve, reject) => {
        levelDB._getLevelDBData(walletAddress).then(responseMessage => {
            const responseMessageObject = JSON.parse(responseMessage);

            //is already validated for star registration?
            const registerStar = responseMessageObject.registerStar;
            if (registerStar !== undefined)
                if (!registerStar)
                    resolve(responseMessageObject.status);
                else
                    reject("Identity is already valid!, please navigate to /block for star registration");
        });
    });

};
