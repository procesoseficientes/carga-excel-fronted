"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const app = express_1.default();
app.use('/static', express_1.default.static('public'));
app.use('/src', express_1.default.static('src'));
app.use('/views', express_1.default.static('views'));
app.use(express_fileupload_1.default({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.set('port', process.env.PORT || 5000);
app.engine('.hbs', express_handlebars_1.default({
    defaultLayout: 'layout',
    partialsDir: path_1.default.join(__dirname, 'views/partials'),
    extname: '.hbs',
    helpers: {
        json: (context) => JSON.stringify(context)
    }
}));
app.use(express_session_1.default({ cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false }));
app.use(connect_flash_1.default());
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    //app.locals.user = req.user;
    next();
});
app.set('view engine', '.hbs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.get('/', function (req, res) {
    res.render('home');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/bonificaciones', function (req, res) {
    res.render('listaBonificaciones');
});
app.post('/upload', function (req, res) {
    let uploadedFile;
    let uploadPath;
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    uploadedFile = req.files.uploadedFile;
    uploadPath = __dirname + '/files/' + uploadedFile.name;
    // Use the mv() method to place the file somewhere on your server
    uploadedFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
});
app.get('/descuentos', function (req, res) {
    res.render('listaDescuentos');
});
app.listen(app.get('port'), () => console.log('server running on port ' + app.get('port')));
