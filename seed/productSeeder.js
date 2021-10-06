const Product = require('../models/product');
const mongoose = require('mongoose');
const db = require('../config/key').MongoURI;
// const product = require('../models/product');
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const products = [
    new Product({
        imagePath: "https://cdn.vox-cdn.com/thumbor/J7TeX-vsd-iyrQUj4Zj04AJpWv0=/0x0:1024x576/1200x800/filters:focal(431x207:593x369)/cdn.vox-cdn.com/uploads/chorus_image/image/66496903/Switch_PokemonSwordPokemonShield_screen_198.0.jpg",
        title: "Gothic Video Game",
        description: "Awesome Game!!!!",
        price: 10
    }),
    new Product({
        imagePath: "https://compass-ssl.xbox.com/assets/21/02/21020efb-695f-4f43-b639-bb075f567cc9.jpg?n=PC-Gaming_Mosaic-Small-0_Wasteland-3_542x400.jpg",
        title: "Gothic Video Game",
        description: "Awesome Game!!!!",
        price: 15
    }),
    new Product({
        imagePath: "https://images-na.ssl-images-amazon.com/images/I/81uvIwL7UDS.png",
        title: "Gothic Video Game",
        description: "Awesome Game!!!!",
        price: 25
    }),
    new Product({
        imagePath: "https://i.pcmag.com/imagery/roundups/03238eOHzMtNAsyU8sWbsXV-1..1600107026.jpg",
        title: "Gothic Video Game",
        description: "Awesome Game!!!!",
        price: 28
    }),
    new Product({
        imagePath: "https://i.redd.it/lmkadsnxhhb51.jpg",
        title: "Gothic Video Game",
        description: "Awesome Game!!!!",
        price: 28
    })
];

let done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save((err, result) => {
        console.log('Products save');
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}