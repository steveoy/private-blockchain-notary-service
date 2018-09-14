const Star = require('../domain/star');
const MessageQueue = require('../domain/messageQueue').MessageQueue;
const simpleChain = require('../domain/simpleChain');

const Block = simpleChain.Block;
const Blockchain = simpleChain.Blockchain;
const blockchain = new Blockchain();

exports.registerStar = function (address, star) {
    return new Promise((resolve, reject) => {
        MessageQueue.getMessage(address).then(message => {
            if (message.registerStar) {
                MessageQueue.removeMessage(address); //Authorized to register single star only.
                const body = {
                    address: address, star: new Star(star)
                };
                blockchain.addBlock(new Block(body)).then(() => {
                    blockchain.getBlock(blockchain.blockHeight).then(block => {
                        resolve(block);
                    });
                });
            }
            else if (message.registerStar === false)
                reject("Not Autorized!. Please validate a new message signature.");
            else
                reject("Not Autorized!. Please request validation first!.");
        }).catch(err => {
            reject("Not Autorized!. Please request validation first!.");
        });

    });

};

exports.getStarByOwnerAddress = function (address) {
    return new Promise((resolve, reject) => {
        blockchain.getBlocksByBodyContent(address, '$.body.address').then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
};


exports.getStarByBlockHash = function (blockHash) {
    return new Promise((resolve, reject) => {
        blockchain.getBlockByHash(blockHash).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
};