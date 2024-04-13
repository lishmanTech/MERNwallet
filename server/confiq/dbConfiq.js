const mongoose = require("mongoose");


     mongoose.connect(process.env.MONGO_URL);
    
    const connecttionResult = mongoose.connection

    connecttionResult.on('error', ()=>{
        console.log(`Error Connecting to database`);
    });
    connecttionResult.on('connected', ()=>{
        console.log(`Connected to database`);
    });
 

// module.exports = connecttionResult;
