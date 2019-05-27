const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: '5cec42d51bf8cd4388f8932d'}).then((todo) => {
    
});

Todo.findByIdAndRemove('5cec42d51bf8cd4388f8932d').then((todo) => {
    console.log(todo);
});