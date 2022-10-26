const express = require('express');
const port = 4000;
const app = express();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static(__dirname));

app.use(cookieParser());

var session;




app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.listen(port, () => {
    console.log("Running")
})




// For the Connection, Registration, Login
const mongoose = require("mongoose");

mongoose.connect("", { useNewUrlParser: true }, { useUnifiedTopology: true});



// Contact
// Setting the contactSchema
const contactSchema = {
  name: String,
  email: String,
  subject: String,
  message: String
}

// Contact Model accessing contactSchema
const Contact = mongoose.model("Contacts", contactSchema);

app.post("/contact", async function(req, res) {

  async function sendContact(){
    let newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    });
    await newContact.save();
  }
  return sendContact();
});


// Setting the userSchema
const userSchema = {
  email: String,
  username: String,
  password: String
}
// User Model accessing userSchema
const User = mongoose.model("Users", userSchema);


// Registration
app.post("/registration", async function(req, res) {
  try {
    const { email, username, password, passwordCheck } = req.body;
    // VALIDATING
    // STATUS CODE 300: BAD REQUEST
    // STATUS CODE 500: INTERNAL SERVER ERROR

    if (!email || !username || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Es wurden nicht alle Felder ausgefüllt" });
    }
    // CHECKING THE PASSWORD ENTERED VS THE PASSWORD CHECKER
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Passwörter stimmen nicht überein. Bitte versuche es erneut" });
    }
    // CHECKING DATABASE AND EMAIL CHECK TO ENSURE NO DUPLICATE EMAILS UPON REGISTERING  
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ msg: "Ein Konto mit dieser E-Mail existiert bereits" });
    }
    // CHECKING DATABASE AND USERNAME CHECK TO ENSURE NO DUPLICATE USERNAMES UPON REGISTERING  
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ msg: "Benutzername ist vergeben" });
    }
    // USING BCRYPT TO HASH PASSWORDS FOR SECURITY 
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // CREATING NEW USER, PASSWORD WILL BE THE HASHED PASSWORD AND NOT ENTERED PASSWORD
    const newUser = new User({
      email: email,
      username: username,
      password: passwordHash
    });
    await newUser.save();
    return newUser;
  
    // CATCHING ERRORS
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "thisismysecretkeyfhasdhk32",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));


app.post('/member.html', async (req,res) => {
  try {
    const { username, password } = req.body;
    // VALIDATE
    if (!username || !password) {
    return res.status(400).json({ msg: "Es wurden nicht alle Felder ausgefüllt" });
    }
    // CHECKING USERNAME THAT WAS ENTERED AND COMPARING EMAIL IN DATABASE
    const user = await User.findOne({ username: username });
    if (!user) {
    return res
      .status(400)
      .json({ msg: "Ungültige Anmeldeinformationen" });
    }
    // CHECKING PASSWORD ENTERED AND COMPARING IT WITH HASHED PASSWORD IN DATABASE
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(400).json({ msg: "Ungültige Anmeldeinformationen" });
    }

    if(username && password){
      session = req.session;
      session.userid = req.body.username;
      console.log(req.session)
      res.sendFile('private/member.html', {root:__dirname});
    } else {
      return res.status(400).json({ msg: "Benutzername oder Passwort ist nicht korrekt."});
    }

  } catch (error) {
    res.status(500).json({ err: error.message });
  }
})


