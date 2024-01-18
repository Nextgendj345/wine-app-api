const express = require('express');
const app= express();
const wineroute= require('./routes/Wine')
const userroute= require('./routes/User')
const port = 5000;

// Middleware to parse incoming JSON data
app.use(express.json());

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
})


app.use('/testwine',wineroute);
app.use('/testuser',userroute);
app.listen(port)
module.exports =app