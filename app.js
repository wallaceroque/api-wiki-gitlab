/*** DEPENDÊNCIAS ***/
//const git = require('nodegit');
const Wiki = require('./services/wikis');
const path = require('path');
const express = require('express');
/***/

/*** INICIALIZAÇÕES ***/
const wiki = {
    url: 'http://gitlab.wallace.com/wallace/myproject.wiki.git',
    name: 'myproject.wiki',
    stg: path.join(__dirname, 'wikis')
}

let myProjectWiki = new Wiki(wiki);

const app = express();
/***/

/*** APIS ***/
app.get('/clone', (req, res) => {
    myProjectWiki.clone()
        .then((msg) => res.send(msg))
        .catch((err) => res.status(500).send(err))
});

app.get('/pull', (req, res) => {
    myProjectWiki.pull()
        .then((msg) => res.send(msg))
        .catch((err) => res.status(500).send(err))
});

/***/

app.listen(3000, () => {
    console.log('Listening on port 3000');
});


