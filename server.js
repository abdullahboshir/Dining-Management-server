const mongoose = require('mongoose');
require('dotenv').config();
require('colors');
const app = require('./app')

const {DB_NAME, DB_PASS, DB_COLL, PORT} = process.env;
const uri = `mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.jkxoji6.mongodb.net/${DB_COLL}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongodb connection is successful'?.bold?.yellow)
}).catch((error) => console.log(`Mongodb connection is failed: ${error}`)?.bold?.red);


const port = PORT || 5000; 

app.listen(port, () => {
    console.log(`app is running on port ${port}`.bold?.yellow)
});