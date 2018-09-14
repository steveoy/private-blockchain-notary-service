const express = require('express');
const routes = require('./routes/routes');
const app = express();
 
app.set('json spaces', 2); // number of spaces for indentation

app.use(express.json()); 
routes.assignRoutes(app); 

app.listen(8000);