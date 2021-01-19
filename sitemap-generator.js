const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');

require('dotenv').config({ path: resolve(`${__dirname}`,`.env`) });
const { generate } = require('./generate-sitemap');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/', async (req, res) => {
    if (req.headers.authorization !== process.env.WEBHOOK_TOKEN){
        res.status(403).send({
            status: 403,
            message: "Please authenticate"
        });
    } else if (['entry.create', 'entry.update', 'entry.delete'].includes(req.body.event) &&
               ['post', 'category'].includes(req.body.model)){
        console.log("Trigger regenerate sitemap...");
        generate(process.env.HOST, 'sitemaps', './public',
            ['/api/', '/login'])
            .then(() => {
                console.log("Sitemap successfully regenerated!");
            })
            .catch(err =>{
                console.log(`Generate sitemap error: ${err}`);
            });

        res.status(200).send({
            status: 200,
            message: "Successfully trigger regenerate sitemap..."
        });
    }else{
        res.status(200).send({
            status: 200,
            message: 'Skip generate sitemap, invalid event or model',
            event: req.body.event,
            model: req.body.model
        });
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Sitemap Generator at http://localhost:${process.env.PORT}`)
})
