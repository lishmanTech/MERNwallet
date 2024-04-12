const express = require('express');
const app = express();
const path = require('path')

__dirname = path.resolve();

require('dotenv').config();
app.use(express.json())

const dbconfiq = require('./confiq/dbConfiq');
const usersRoute = require('./routes/usersRoute')
const transactionRoute = require('./routes/transactionRoute')
const requestRoute = require('./routes/requestsRoute')

 app.use(express.static(path.join(__dirname, './client/build')))

app.use('/api/users', usersRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/requests', requestRoute)


app.use('*', function(req, res){
   res.sendFile(path.join(__dirname, "./client/build/index.html"));
});



const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
   console.log(`server started at port ${PORT}`);
})
