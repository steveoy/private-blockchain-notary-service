var validation = require('./validation');

var blocks = require('./blocks');

var stars = require('./stars');


exports.assignRoutes = function (app) {
    
    app.post('/requestValidation', validation.requestValidation);

    app.post('/message-signature/validate', validation.messageSignatureValidation);

    app.post('/block', stars.registerStar);

    app.get('/block/:blockHeight', blocks.getBlock);


    ///stars/address:[ADDRESS]
    app.get('/stars/address/:ADDRESS', stars.getStarByOwnerAddress);

    //GET /stars/hash:[HASH]
    app.get('/stars/hash/:HASH', stars.getStarByBlockHash);

}