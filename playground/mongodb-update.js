const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server.');
    }

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5ce44c194492d7231881d793')
    // },{
    //     $set:{
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5ce44d0427fb2f0150287b04')
    },{
        $set:{
            name: 'Vishal'
        },
        $inc:{
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
});