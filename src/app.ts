import express from 'express';
import path from 'path'


import exphbs from 'express-handlebars';

const app = express();

app.use('/static',express.static('public'));
// app.use('/discount', require('./views'));


app.set('port', process.env.PORT || 5000 );
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'layout',
    helpers: {
      json: (context: string) => JSON.stringify(context)
    }
  }) 

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))


app.get('/',function(req,res){
    res.render('home');
});

app.get('/bonificaciones',function(req,res){
  res.render('listaBonificaciones');
});

app.get('/descuentos',function(req,res){
  res.render('listaDescuentos');
});


app.listen(app.get('port'), () => console.log('server running on port ' + app.get('port')));