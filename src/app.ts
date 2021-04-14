import express from 'express';
import path from 'path'
import flash from 'connect-flash';
import session from 'express-session'
//const flash = require('connect-flash')
import exphbs from 'express-handlebars';
//import papa from 'papaparse'

const app = express();

app.use('/static',express.static('public'));
app.use('/views', express.static('views'))
app.use('/js', express.static('js'))


app.set('port', process.env.PORT || 5000 );
// const hbs = exphbs.create({
//     extname: '.hbs',
//     defaultLayout: 'layout',
//     partialsDir: path.join(app.get('views'), 'partials'),
//     helpers: {
//       json: (context: string) => JSON.stringify(context)
//     }
//   }) 

app.engine('.hbs', exphbs({
    defaultLayout: 'layout',
    //layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'views/partials'),
  ],
    extname: '.hbs',
    helpers: {
              json: (context: string) => JSON.stringify(context)
            }
}));

app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}));

app.use(flash());

  app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    //app.locals.user = req.user;
    next();
  });

//app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))


app.get('/',function(req,res){
    res.render('home');
});

app.get('/login',function(req,res){
  res.render('login');
});

app.get('/bonificaciones',function(req,res){
  res.render('listaBonificaciones');
});

app.get('/descuentos',function(req,res){
  res.render('listaDescuentos');
});


app.listen(app.get('port'), () => console.log('server running on port ' + app.get('port')));