import express from 'express';
import path from 'path'


import exphbs from 'express-handlebars';

const app = express();

app.use('/static',express.static('public'));


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


app.listen(5000, () => console.log('server running'));