var express = require('express');
var exphbs  = require('express-handlebars');
const path = require("path");
const config = require("config");
var cookieParser = require('cookie-parser');
const session = require('express-session');

var app = express();
 
app.engine(
    "handlebars",
    exphbs({
      extname: "handlebars",
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "views/layouts"),
      partialsDir: [
        path.join(__dirname, "views/partials")
      ]
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'AnotherSimpleSecretStringggg',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 }
}));

app.use('/public', express.static(path.join(__dirname, "public")));

app.get('/captcha/captcha.png', require("./routes/captcha").captcha);

app.use("/tasty-treats2", require("./routes/task"));

/*
app.get("*", (req, res)=>{
	console.log(req.path);
	res.end();
});

*/

const listenPort = 8000;

try {
  listenPort = config.get("PORT");
} catch (error) {}

app.listen(listenPort, () =>{
	console.log(`Nodejs App Running at [http://localhost:${listenPort}/tasty-treats2/contactus]`);
});
