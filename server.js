if(process.env.NODE_ENV !== 'production') {
     require('dotenv').config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport=require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

if (typeof localStorage === "undefined" || localStorage === null) {
     var LocalStorage = require('node-localstorage').LocalStorage;
     localStorage = new LocalStorage('./scratch');
   }

const initializePassport = require('./passport-config');
initializePassport(
     passport,
     email=>users.find(user=>user.email===email),
     id=>users.find(user=>user.id===id)
);

const users = localStorage.getItem('myKey')||[];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
     secret:process.env.SESSION_SECRET,
     resave:false, 
     saveUninitialized:true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
     res.render("index.ejs");
});



// here you will add your new paths 
// format:

// app.get("/_",checkAuthentication, (req, res) => {
//      res.render("_.ejs");
// });

// replace _ with the name of your page
// remember to end your file with .ejs dont worry about html
// make sure your path name and path at anchor tag matches


app.get("/instructions",checkAuthentication, (req, res) => {
     res.render("instructions.ejs");
});
app.get("/final1",checkAuthentication, (req, res) => {
     res.render("final1.ejs");
});
app.get("/final2",checkAuthentication, (req, res) => {
     res.render("final2.ejs");
});
app.get("/final3",checkAuthentication, (req, res) => {
     res.render("final3.ejs");
});
app.get("/final4",checkAuthentication, (req, res) => {
     res.render("final4.ejs");
});
app.get("/final5",checkAuthentication, (req, res) => {
     res.render("final5.ejs");
});




app.get("/login",checkNotAuthentication, (req, res) => {
     res.render("login.ejs");
});

app.post("/login",checkNotAuthentication, passport.authenticate('local',{
     successRedirect:'/',
     failureRedirect:'/login',
     failureFlash:true,
}));

app.get("/register",checkNotAuthentication, (req, res) => {
     res.render("register.ejs");
});

app.post("/register",checkNotAuthentication, async (req, res) => {
     try {

          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          console.log(users);
          users.push({
               id: Date.now().toString(),
               name: req.body.name,
               email: req.body.email,
               password: hashedPassword,
          });
          localStorage.setItem('myKey',JSON.stringify(users));
          res.redirect("/login");
     } catch (err) {
          console.log(err);
          res.redirect("/register");
     }
     console.log(users);
});

app.delete('/logout',(req,res,next)=> {
     req.logout(err=> {
          if (err) { return next(err); }
          res.redirect('/login');
        });
});

function checkAuthentication(req,res,next) {
     if(req.isAuthenticated()) {
          return next();
     }
     res.redirect('/');
}
function checkNotAuthentication(req,res,next) {
     if(req.isAuthenticated()) {
          return res.redirect('/instructions');
     }
     next();
}

app.listen(process.env.PORT||5000);
