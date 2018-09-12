const express = require('express');
const block = require('./routes/block');
const validation = require('./routes/validation');
const app = express();



app.use(express.json());
app.use('', validation);
app.use('/block', block);

const routes = require('./routes/routes');
routes.assignRoutes(app);

//Step 2: Configure Star Registration Endpoint
// POST /block
// done in block.js


//Step 3: Configure Star Lookup
// GET /stars/address:[ADDRESS]

// GET /stars/hash:[HASH]

// GET /block/[HEIGHT]
//done in block.js



app.listen(8000);