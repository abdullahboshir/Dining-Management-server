const mongoose = require('mongoose');
// const Schema = mongoose.Schema;



const postSheema = new mongoose.Schema({
    authorId: {
        type: String,
        ref: 'User',
        required: true
    },
textArea: {
type: String,
required: true
},
img:[{
    name: String,
    path: String
}],
createAt: Date,
updatedAt: Date
}, 
{ timestamps: true});




const Post = mongoose.model('Post', postSheema);


module.exports = Post;


