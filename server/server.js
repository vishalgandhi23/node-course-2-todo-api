var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400).send();
    });
});

app.get('/todos/:id', (req,res) => {
    var id=req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            res.status(404).send({});
        }else{
            res.status(200).send({todo});
        }
    }, (err) => {
        res.status(400).send({});
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000.');
});

module.exports = {app};

// var mongoose = require('mongoose');

// mongoose.Promise= global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');

// var Todo = mongoose.model('Todo',{
//     text:{
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     },
//     completedAt:{
//         type: Number,
//         default: null
//     }
// });

// var User = mongoose.model('User',{
//     email:{
//         type: String,
//         required: true,
//         minlength: 1,
//         trim:  true
//     }
// });

// var newTodo = new Todo({
//     text:  'Cook dinner'
// });

// newTodo.save().then((doc) =>{
//     console.log('Saved Todo', doc);
// }, (e) => {
//     console.log('Unable to save todo');
// });

// var newTodo2 = new Todo({
//     text: 'Edit this video'
// });

// newTodo2.save().then((doc) => {
//     console.log('Saved Todo2',doc);
// }, (error) => {
//     Console.log('Unable to save Todo2.');
// });

// var newUser = new User({
//     email: 'vishalgandhi94@gmail.com'
// });

// newUser.save().then((doc) => {
//     console.log('Saved new user',doc);
// },(error) => {
//     console.log('Unable to save user');
// });