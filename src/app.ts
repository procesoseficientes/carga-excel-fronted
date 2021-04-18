import express from 'express';
import path from 'path'
import flash from 'connect-flash';
import session from 'express-session'
import fileUpload, { UploadedFile } from 'express-fileupload';
import exphbs from 'express-handlebars';

const app = express();

app.use('/static',express.static('public'));
app.use('/src', express.static('src'));
app.use('/views', express.static('views'))



app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));


app.set('port', process.env.PORT || 5000 );

app.engine('.hbs', exphbs({
    defaultLayout: 'layout',
    partialsDir  : path.join(__dirname, 'views/partials'),
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


app.post('/upload', function(req, res) {
  let uploadedFile:UploadedFile;
  let uploadPath:string;

  console.log(req.files)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  uploadedFile = req.files.uploadedFile as UploadedFile;
  uploadPath = __dirname + '/files/' + uploadedFile.name;

  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});


app.get('/descuentos',function(req,res){
  res.render('listaDescuentos');
});


app.listen(app.get('port'), () => console.log('server running on port ' + app.get('port')));