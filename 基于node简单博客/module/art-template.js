const expressTemplat=require('express-art-template');
const artTemplate=require('art-template');

artTemplate.defaults.root='./views';
artTemplate.defaults.extname='.html';

function  artTemplateEngine(app) {
    app.engine('html',expressTemplat);
    app.set('view engine','html');
}
module.exports=artTemplateEngine;