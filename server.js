const express = require('express');
const app = express();
const bp = require('body-parser');

//IMPORT REQUIRED CONFIG FILES
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {TODO} = require('./db/todos');
const {USER} = require('./db/users');
const port = process.env.PORT || 3000;

app.use(bp.json());

app.post('/todos', (req, res) => {
    const todo = new TODO({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    });
});
app.post('/users', (req, res) => {
    const user = new USER({
        email: req.body.email
    });
    user.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err)
    });
});
app.get('/todos', (req, res) => {
    TODO.find().then((docs) => {
        res.send({docs});
    }, (err) => {
        res.status(400).send(err);
    })
});
app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
    }
    USER.findById(id).then((doc) => {
        if(!doc){
            return res.status(404).send('Cant find that ID BUDDY')
        }
        res.send(doc);
    }, (err) => res.status(400).send(err.message))
});
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
    }
    USER.findByIdAndDelete(id).then((user) => {
        if(!user){
            return res.status(404).send('Cant find that ID BUDDY!!!');
        }
        res.send(user);
    }, (err) => res.status(400).send(err.message));
});
app.patch('/users/:id', (req, res) => {
    const {id} = req.params;
    const {email} = req.body;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
    }
    if(email){
        USER.findByIdAndUpdate(id, {$set: {email}}, {new: true}).then((doc) => {
            res.send(doc);
        }).catch((err) => res.status(400).send(err.message));
    }
});
app.patch('/todos/:id', (req, res) => {
    const {id} = req.params;
    let {text, completed} = req.body;
    let completedAt;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
    }
    if(completed){
        completedAt = new Date().getTime();
    }else{
        completed = false;
        completedAt = null
    }
    TODO.findByIdAndUpdate(id, {$set: {completed, completedAt, text}}, {new: true}).then((doc) => {
        if(!doc){
            return res.status(404).send('Cant find that ID BUDDY')
        }
        res.send(doc);
    }).catch((err) => res.status(400).send(err.message))
});

app.listen(port, () => console.log('Server started'));
