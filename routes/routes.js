var validation = require('./validation');

var block = require('./block');

var stars = require('./stars');


exports.assignRoutes = function (app) {
    app.post('/requestValidation', validation.requestValidation);

    app.post('/message-signature/validate', validation.messageSignatureValidation);

    app.post('/block', block.addBlock);

    app.get('/block/:blockHeight', block.getBlock);


    app.post('/groups', groups.createGroup);
    app.get('/groups/:groupId', groups.getGroup);

    app.post('/graphQL', graphQL.getQuery);
}