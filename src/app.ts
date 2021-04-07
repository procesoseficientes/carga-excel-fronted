import express from 'express';
import path from 'path'
import fileUpload, { UploadedFile } from 'express-fileupload';

import exphbs from 'express-handlebars';

const app = express();

app.use('/static',express.static('public'));
app.use('/src', express.static('src'));



app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));


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

app.get('/login',function(req,res){
  res.render('login');
});

app.get('/bonificaciones',function(req,res){
  res.render('listaBonificaciones');
});


app.post('/upload', function(req, res) {
  let uploadedFile:UploadedFile;
  let uploadPath:string;

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