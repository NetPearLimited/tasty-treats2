const router = require("express").Router();
const config = require("config");
var mysql = require('mysql');
const { check, validationResult } = require("express-validator");

router.get("/contactus", (_req, res) => {
  res.render("contactus", { layout: "main" });
});

router.get("/login", (req, res) => {
    if(req.session.isLogged==true){
        return res.redirect('/tasty-treats/dashboard');
    }

    res.render("login", { layout: "main" });
});

router.get("/logout", (req, res) => {

    req.session.destroy(()=>{
        res.redirect('/tasty-treats2/login');
    });
    
});

router.get("/dashboard", (req, res) => {

    if(req.session.isLogged!=true){
        return res.redirect('/tasty-treats2/login');
    }

    var connection = mysql.createConnection({
        host     : config.get('hostname'),
        user     : config.get('username'),
        password : config.get('password'),
        database : config.get('database')
    });
       
    connection.connect();
    
    connection.query('select * from form_element order by id desc', function (error, results, fields) {
        if (error) throw error;

        let messages = [];

        for(let i=0; i<results.length; i++){
            messages.push({
                pos : i+1,
                name : results[i].name,
                email : results[i].email,
                message : results[i].message,
                subscribe : results[i].subscribe,
                time : new Date(results[i].time).toLocaleString()

            })
        }

        res.render("dashboard", { layout: "main", name : config.get("adminUsername"), messages : messages });
    });
       
    connection.end();
    
});

router.post("/login",
[
    check("name").exists(),
    check("password").exists()

  ], (req, res) => {

    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", { errorMessage: "Please fill all fields!", layout: "main" });
    }

    let {name, password} = req.body;

    console.log(name, password);

    if(name!=config.get("adminUsername") || password!=config.get("adminPassword")){
        return res.render("login", { errorMessage: "Invalid credentials !", layout: "main" });
    }

    req.session.isLogged = true;
    res.redirect('/tasty-treats2/dashboard');
});

router.post(
  "/sendmessage",
  [

    check("email").isEmail(),

    check("message").exists(),

    check("name").exists(),

    check("captcha").exists(),

    check("subscribe").exists(),

    check("subscribe-to-newsletters").exists()

  ],
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success:false, errors: errors.array() });
    }

    let { message, name, email, captcha, subscribe } = req.body;
    let subscribeToNewsletters = req.body["subscribe-to-newsletters"];

    if (captcha != req.session.captcha) {
        return res.json({success: false, errors : [{param : 'captcha', msg: 'Invalid Captcha'}]});
    }

    //SAVE MESSAGE

    var connection = mysql.createConnection({
        host     : config.get('hostname'),
        user     : config.get('username'),
        password : config.get('password'),
        database : config.get('database')
    });
       
    connection.connect();
    
    connection.query('INSERT INTO `form_element`( `name`, `email`, `message`, `subscribe`, `time`) VALUES ( ?, ?, ?, ?, ?)', [
        name, email, message, subscribe, new Date()
    ], function (error, _results, _fields) {
        
        if (error){
            console.log(error);

            return ies.json({success: false, errors: [{param: "Error", msg: "Internal Error! Try Again!"}]});
        } 

       return  res.json({success: true});
    });
       
    connection.end();

  }
);


module.exports = router;
