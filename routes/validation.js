const Joi = require('joi');
const levelDB = require('../levelDB_module')('validationdata');
const bitcoinMessage = require('bitcoinjs-message');
const express = require('express');
const router = express.Router();



//Step 1: Configure Blockchain ID validation routine
// POST /requestValidation routine
router.post('/requestValidation', (req, res) => {

    const schema = {
        address: Joi.string().required()
    }

    const { error } = Joi.validate(req.body, schema);
    if (error)
        return res.status(400).send(error.details[0].message);

    const walletAddress = req.body.address;
    const currentTimeStamp = new Date().getTime().toString().slice(0, -3);
    levelDB._getLevelDBData(walletAddress).then(responseMessage => {
        let responseMessageObject = JSON.parse(responseMessage);
        
        const registerStar = responseMessageObject.registerStar;
        if (registerStar !== undefined)
            if (registerStar)
                return res.status(400).send("Identity is already valid!, please navigate to /block for star registration");
            else
                responseMessageObject = responseMessageObject.status;

        const validationWindow = 300 - (currentTimeStamp - responseMessageObject.requestTimeStamp);
        if (validationWindow <= 0) {
            levelDB._deleteLevelDBData(walletAddress);
            return res.status(400).send("Validation window is expired!. Please request validation again!");
        }
        else {
            responseMessage = { "address": walletAddress, "requestTimeStamp": responseMessageObject.requestTimeStamp, "message": responseMessageObject.message, "validationWindow": validationWindow };

            levelDB._updateLevelDBData(walletAddress, JSON.stringify(responseMessage)).then(result => {
                if (result === "success")
                    return res.send(responseMessage);
            });
        }
    }).catch(err => {

        if (err) {
            if (err.notFound) {
                const message = walletAddress + ":" + currentTimeStamp + ":starRegistry";
                const responseMessage = { "address": walletAddress, "requestTimeStamp": currentTimeStamp, "message": message, "validationWindow": 300 };
                levelDB._addLevelDBData(walletAddress, JSON.stringify(responseMessage));
                return res.send(responseMessage);
            }

        }
        return res.status(400).send("errrrrrrr: " + err);
    });
});
// POST /message-signature/validate
// bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin)
router.post('/message-signature/validate', (req, res) => {
    const schema = {
        address: Joi.string().required(),
        signature: Joi.string().required()
    }

    const { error } = Joi.validate(req.body, schema);
    if (error)
        return res.status(400).send(error.details[0].message);

    const walletAddress = req.body.address;
    const messageSignature = req.body.signature;


    levelDB._getLevelDBData(walletAddress).then(responseMessage => {
        const responseMessageObject = JSON.parse(responseMessage);
        const currentTimeStamp = new Date().getTime().toString().slice(0, -3);
        const validationWindow = 300 - (currentTimeStamp - responseMessageObject.requestTimeStamp);
        if (validationWindow <= 0) {
            levelDB._deleteLevelDBData(walletAddress);
            return res.status(400).send("Validation window is expired!. Please request validation again!");
        }
        else {
            const result = bitcoinMessage.verify(responseMessageObject.message, walletAddress, messageSignature);
            const response = {
                "registerStar": result,
                "status": {
                    "address": walletAddress,
                    "requestTimeStamp": responseMessageObject.requestTimeStamp,
                    "message": responseMessageObject.message,
                    "validationWindow": validationWindow,
                    "messageSignature": (result == true ? "valid" : "invalid")
                }
            };
            levelDB._updateLevelDBData(walletAddress, JSON.stringify(responseMessage)).catch(err => {
                console.log(err);
            });
            return res.status(200).send(response);
        }
    }).catch(err => {
        if (err) {
            if (err.notFound) {
                return res.status(400).send("Please request validation using /requestValidation routine.");
            }

        }
        return res.status(400).send(err.toString());
    });
});

module.exports = router;