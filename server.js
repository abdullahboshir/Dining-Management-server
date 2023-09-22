const mongoose = require('mongoose');
require('dotenv').config();
require('colors');
const app = require('./app');
const { updateMealInfoData, studentLoginService, userLoginService } = require('./services/dining.service');

const { DB_NAME, DB_PASS, DB_COLL, PORT } = process.env;
const uri = `mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.jkxoji6.mongodb.net/${DB_COLL}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {

    console.log('MongoDB connection is successful'.yellow.bold);

    // const collections = await mongoose.connection.db.collections();
    // const studentCollections = collections.filter((collection) =>
    //     collection.collectionName.includes('student')
    // );

    // studentCollections.forEach((collection) => {
    //     console.log(`Student Collection Name: ${collection.collectionName}`);
    // });

    // setInterval(() => {
    //     updateMealInfoData();
    //   }, 24 * 60 * 60 * 1000);
    updateMealInfoData()
    studentLoginService() 
    userLoginService()
    // getDbCollectionName()

}).catch((error) => console.log(`Mongodb connection is failed: ${error}`)?.bold?.red);





const port = PORT || 5000;

app.listen(port, () => {
    console.log(`app is running on port ${port}`.bold?.yellow)
});







// const getDbCollectionName = async () => {
//   try {
//     // Establish a connection to the MongoDB database
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Get a list of all collections in the database
//     const collections = await mongoose.connection.db.collections();

//     // Filter collections that contain the word "student" in their names
//     const studentCollections = collections.filter((collection) =>
//       collection.collectionName.includes('student')
//     );

//     // Extract the collection names and store them in an array
//     const dbName = studentCollections.map((collection) => collection.collectionName);

//     console.log(`Student Collection Names: ${dbName}`);

//     // Return the array of collection names
//     return dbName;
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     // Close the MongoDB connection
//     mongoose.connection.close();
//   }
// };

// module.exports = getDbCollectionName;
