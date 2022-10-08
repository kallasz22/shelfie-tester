//init app
const express = require('express');
const app = express();

//database
const mongoose = require('mongoose');
if (process.env.dbUsername) {
    mongoose.connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@shelfiecluster.cow3v5m.mongodb.net/?retryWrites=true&w=majority`).then(function(){
        app.listen(5000);
    });
} else {
    const config = require('./config.json');
    mongoose.connect(`mongodb+srv://${config.dbUsername}:${config.dbPassword}@shelfiecluster.cow3v5m.mongodb.net/?retryWrites=true&w=majority`).then(function(){
        app.listen(5000);
    });
}

//bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//cookieparser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//auth
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('./models/user');

app.use(express.static(__dirname + '/public'));

app.post('/signin', async function(req, res){
    const user = await User.findOne({
        username: req.body.username_si
    });

    if (user) {
        const pwC = await bcrypt.compare(req.body.password_si, user.password);
        if (!pwC) {
            res.status(404).send('WRONG PASSWORD');
            return;
        }

        const token = crypto.randomUUID();
        user.tokens.push(token);

        await user.save();

        res.cookie("session", token).redirect('/portal');
    }
    else{
        res.status(404).send('USER NOT FOUND');
        return;
    }
});

app.post('/signup', async function(req, res){
    const user = new User();
    const existAlready = await User.findOne({username: req.body.username_su});
    if (!existAlready) {
        user.username = req.body.username_su;

        const hash = await bcrypt.hash(req.body.password_su, 10);
        user.password = hash;
        
        user.houses.push({name: 'Default house', description: 'The default house. Automatically created.', rooms: {name: 'Default room', description: 'The default room. Automatically created.', shelfs: {name: 'Default shelf', description: 'The default shelf. Automatically created.'}}});
        await user.save();
        res.redirect('/account');
    } else {
        res.status(404).send('USERNAME IS ALREADY USED');
    }
    
});

app.get('/load', accountOnly, async function(req, res){
    const user = await req.user;
    res.type('application/json').send(JSON.stringify(user));
});

app.post('/new-house', accountOnly, async function(req, res){
    const user = req.user;

    user.houses.push({
        name: req.body.nh_name,
        description: req.body.nh_description
    });
    await user.save();
    res.redirect('/portal');
});

app.post('/new-room', accountOnly, async function(req, res){
    const user = req.user;
    
    let i = 0;
    while (i < user.houses.length && user.houses[i].name != req.body.nr_house) {
        i++;
    }

    if (i == user.houses.length) {
        res.status(404).send('ERROR');
        return;
    }

    user.houses[i].rooms.push({
        name: req.body.nr_name,
        description: req.body.nr_description
    });
    
    await user.save();
    res.redirect('/portal');
});

app.post('/new-shelf', accountOnly, async function(req, res){
    const user = req.user;

    let i = 0;
    while (i < user.houses.length && user.houses[i].name != req.body.ns_house) {
        i++;
    }
    if (i == user.houses.length) {
        res.status(404).send('ERROR');
        return;
    }

    let j = 0;
    while (j < user.houses[i].rooms.length && user.houses[i].rooms[j].name != req.body.ns_room) {
        j++;
    }
    if (j == user.houses[i].rooms.length) {
        res.status(404).send('ERROR');
        return;
    }

    user.houses[i].rooms[j].shelfs.push({
        name: req.body.ns_name,
        description: req.body.ns_description
    });

    await user.save();
    res.redirect('/portal');
});

app.post('/new-book', accountOnly, async function(req, res){
    const user = req.user;

    // let i = 0;
    // while (i < user.houses.length && user.houses[i].name != req.body.ns_house) {
    //     i++;
    // }
    // if (i == user.houses.length) {
    //     res.status(404).send('ERROR');
    //     return;
    // }
    // let house = user.houses[i];

    // let j = 0;
    // while (j < house.rooms.length && house.rooms[j].name != req.body.ns_room) {
    //     j++;
    // }
    // if (j == house.rooms.length) {
    //     res.status(404).send('ERROR');
    //     return;
    // }
    // let room = house.rooms[j];

    // let k = 0;
    // while (k < rooms.shelfs.length && rooms.shelfs[k].name != req.body.ns_shelf) {
    //     k++;
    // }
    // if (k == user.houses[i].rooms.length) {
    //     res.status(404).send('ERROR');
    //     return;
    // }
    // let shelf = room.shelfs[k];

    // console.log(req.body.nb_pinned);
    if (req.body.nb_pinned) {
        pinned = true;
    } else {
        pinned = false;
    }

    user.books.push({
        writer: req.body.nb_writer,
        title: req.body.nb_title,
        description: req.body.nb_description,
        type: req.body.nb_type,
        publisher: req.body.nb_publisher,
        yearOfPublication: req.body.nb_yearOfPublication,
        notes: req.body.nb_notes,
        house: req.body.nb_house,
        room: req.body.nb_room,
        shelf: req.body.nb_shelf,
        pinned: pinned
    });

    await user.save();
    res.redirect('/portal');
});

app.post('/delete-book', accountOnly, async function(req, res){
    // console.log(req.body.objectID);
    const user = req.user;

    // let book = await User.findById(req.body.objectID);

    let i = 0;
    while (i < user.books.length && user.books[i]._id != req.body.objectID) {
        i++;
    }

    // console.log(user.books[i]);

    user.books.splice(i, 1);
    
    await user.save();
    res.redirect('/portal');
    // res.redirect('/');
});

async function accountOnly(req, res, next) {
    const token = req.cookies.session;
    if (!token) {
        res.status(403).redirect('/account');
        return;
    }

    const user = await User.findOne({tokens: token});
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(403).redirect('/account');
    }
}

app.get('*', function(req, res){
    res.status(404).redirect('/404.html');
});