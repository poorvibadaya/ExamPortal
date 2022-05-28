var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const multer = require("multer");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//image storage in disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });
//connection of all the database used
var conn = mongoose.createConnection("mongodb://localhost:27017/testA");
var conn2 = mongoose.createConnection("mongodb://localhost:27017/testB");
var conn3 = mongoose.createConnection("mongodb://localhost:27017/testC");

// stored in 'testA' database
var ModelA = conn.model(
  "Model",
  new mongoose.Schema({
    title: { type: String, default: "model in testA database" },
  })
);

// stored in 'testB' database
var ModelB = conn2.model(
  "Model",
  new mongoose.Schema({
    title: { type: String, default: "model in testB database" },
  })
);

// stored in 'testC' database
var ModelC = conn3.model(
  "Model",
  new mongoose.Schema({
    title: { type: String, default: "model in testC database" },
  })
);

//registring and putting information in database
//regirecting to the instructions page
app.post("/sign_up", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var phno = req.body.phno;
  var password = req.body.password;

  var data = {
    name : name ,
    email: email,
    phno: phno,
    password: password,
  };
  conn.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log(data)
    console.log("Record Inserted Successfully");
  });

  return res.redirect("instructions.html");
});

//Redircting to exam page
app.post("/terms", upload.single("uploaded_file"), (req, res) => {
  return res.redirect("signup_success.html");
});
//All the required information getting stored in database
//regirecting to the thank you page
app.post("/done", (req, res) => {
  var ans1 = req.body.ans1;
  var ans2 = req.body.ans2;
  var ans3 = req.body.ans3;
  var ans4 = req.body.ans4;
  var ans5 = req.body.ans4;
  var NoOfAlert = req.body.NoOfAlert;

  var data = {
    ans1: ans1,
    ans2: ans2,
    ans3: ans3,
    ans4: ans4,
    ans5: ans5,
    NoOfAlert: NoOfAlert,
  };
  conn3.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });

  return res.redirect("finish.html");
});

app.get("/", (req, res) => {
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    return res.redirect("index.html");
  })
  .listen(3000);

console.log("Listening on PORT 3000");
