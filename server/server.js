require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos', authenticate, (req,res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400).send();
    });
});

app.get('/todos/:id', authenticate, (req,res) => {
    var id=req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            res.status(404).send({});
        }else{
            res.status(200).send({todo});
        }
    }, (err) => {
        res.status(400).send({});
    });
});

app.delete('/todos/:id', authenticate, (req,res) => {
    var id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/users', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);

    var user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then(() => {
        //res.send(user);
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email,body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    console.log(req.token);
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
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