const express = require('express')
const app = express();
const passport = require('passport')
const bodyParser = require('body-parser')
const expressSession = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
var sql = require('mssql');
// install library ejs << npm install ejs >>>
const keys = require('./mod/key')

// ----------------------------------------------CONFIGURATION------------------------------------
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("https://localhost:" + PORT)
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./src'))
app.set('view engine', 'ejs')
app.set('views', './src/html');
app.use(expressSession({
  secret: 'mySecretKey',
  cookie: {
    maxAge: 1000 * 60 * 100
  }
}));
const config = {
  user: 'sa',
  password: 'buiphilong',
  server: 'localhost',
  database: 'R_System'
}

app.use(passport.initialize());
app.use(passport.session());
sql.connect(config, err => {
  if (err) console.log(err)
})
const request = new sql.Request();
// ---------------------------------------------

passport.use(new LocalStrategy(
  (username, password, done) => {
    request.resume();
    request.query(`select * from dbo.Account Where username = '${username.trim()}' and password = '${password.trim()}'`, (err, result) => {
      if (err) console.log(err)
      else {
        if (result.recordset[0] == undefined) {
          return done(null, false)
        }
        else {
          return done(null, result.recordset[0])
        }
      }
    })

    request.pause();
  }
))

passport.serializeUser(function (user, done) {
  return done(null, user);
})

passport.deserializeUser(function (cookie, done) {
  request.resume();
  request.query(`select * from dbo.Account Where AID = '${cookie.AID}'`, (err, result) => {
    if (err) console.log(err)
    else {
      if (result.recordset[0] == undefined) {
        done(null, false);
      }
      else {
        done(null, cookie);
      }
    }
  });
  request.pause();

})


app.post('/login/confirm', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
})

app.get('/', (req, res) => {
  res.render('public-page')
})

app.post('/get-now/status', (req, res) => {
  if (req.isAuthenticated()) {
    var Information = {};
    if (!req.user.AType) {
      Information.Name = 'CFName';
      Information.Table = 'Candidate';
      Information.ID = 'CID';
    }
    else {
      Information.Name = 'EName';
      Information.Table = 'Employer';
      Information.ID = 'EID';
    }
    request.resume();
    request.query(`Select ${Information.Name} as data from ${Information.Table}
     where ${Information.ID} = '${req.user.AID}'`, (err, result) => {
      if (err) console.log(err)
      else {
        if (result.recordset[0] == undefined)
          res.send(["Not set yet", req.user.AType])
        else
          res.send([result.recordset[0].data, req.user.AType])
      }
    })
    request.pause();
  }
  else {
    res.send([false]);
  }
})


app.get('/logout/confirm', (req, res) => {
  req.logout();
  res.send(true);
})

app.post('/check/su-avai', (req, res) => {
  request.resume();
  request.query(`Select AID from Account WHERE username = '${req.body.mail}'`, (err, result) => {
    if (err) console.log(err)
    else {
      if (result.recordset[0] != undefined) {
        res.send(false);
      }
      else {
        res.send(true);
      }
    }
  })
  request.pause();
})

app.post('/create-new-account/confirm', (req, res, next) => {
  request.resume();
  request.query(`
      INSERT INTO dbo.Account VALUES(
        '${req.body.username}','${req.body.password}',${req.body.AType}
      )
      `, (err, result) => {
    if (err) console.log(err);
    else{
      if (req.body.AType == 1){
        request.query(`
        INSERT INTO dbo.Employer VALUES( (SELECT IDENT_CURRENT('Account')),'${req.body.username}','NULL','NULL',1)
        `)
      }
      else{
        request.query(`
        INSERT INTO dbo.Candidate
        VALUES ((SELECT IDENT_CURRENT('Account')), '${req.body.username}', 'default', '00000000000', '@', '1-1-2000', '000000000' , 0, '');
        `)
      }
      res.send(true)
    }
  })

  request.pause();
})

app.post('/get-full-rec-job/confirm', (req, res) => {
  request.resume();
  request.query(`
  SELECT EName as a,JDescription as b,JTimeStart as c,JTimeEnd_Expected as d,JSalary as e, JID as f FROM Recruitment_Job, Employer WHERE EID = J_EID `,
    (err, result) => {
      if (err) console.log(err);
      else {
        res.send(result.recordset)
      }
    })

  request.pause();
})

app.post('/get-goe-salary/confirm', (req, res) => {
  request.resume();
  request.query(`
  SELECT EName as a,JDescription as b,JTimeStart as c,JTimeEnd_Expected as d,JSalary as e, JID as f FROM Recruitment_Job, Employer 
  WHERE EID = J_EID and JSalary >= ${req.body.sal} `, (err, result) => {
    if (err) console.log(err)
    else {
      res.send(result.recordset);
    }
  });
  request.pause();
})

app.get('/recruitment-job/analyst-', (req, res) => {
  var Obj = {};
  request.resume();
  request.query(`Select * from Recruitment_Job WHERE JID = '${req.query.id}'`, (err, result) => {
    if (err) { console.log(err) }
    else {
      Obj.b = result.recordset[0].JName;
      Obj.c = result.recordset[0].JAddress;
      Obj.d = result.recordset[0].JInsurance;
      Obj.e = JSON.stringify(result.recordset[0].JTimeStart).substring(1, 11);
      Obj.f = JSON.stringify(result.recordset[0].JTimeEnd_Expected).substring(1, 11);
      Obj.g = result.recordset[0].JSalary;
      Obj.h = result.recordset[0].JDOff;
      Obj.k = result.recordset[0].JDescription;
      request.query(`Select * from Employer WHERE EID = ${result.recordset[0].J_EID}`, (err2, result2) => {
        if (err) { console.log(err) }
        else {
          Obj.l = result2.recordset[0].EName;
          Obj.m = result2.recordset[0].EEmail;
          Obj.n = result2.recordset[0].EAddress;
          request.pause();
          res.render('recruit-jobs', { data: "321", Obj: Obj })
        }
      })
    }
  })
})


app.post('/get-peer/recruitment', (req, res, next) => {
  request.resume();
  request.query(`SELECT  RJ.JID as a,RJ.JName as b, RJ.JDescription as c FROM dbo.Recruitment_Job as RJ WHERE J_EID = '${req.user.AID}'`,
    (err, result) => {
      if (err) console.log(err)
      else {
        res.send(result.recordset)
      }
    })
  request.pause();
})


app.get('/my-recruitment-job-raise', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('employer-create-jobs')
  }
  else {
    res.redirect('/')
  }
})

app.post('/get-recruitment-info/confirm', (req,res,next)=>{
  request.resume();
  request.query(`Select * from dbo.Recruitment_Job Where JID = '${req.body.id}'`,(err,result)=>{
    if(err)console.log(err)
    else{
      res.send({
      a : result.recordset[0].JName,
      b : result.recordset[0].JAddress,
      c : result.recordset[0].JInsurance,
      d : JSON.stringify(result.recordset[0].JTimeStart).substring(1, 11),
      e : JSON.stringify(result.recordset[0].JTimeEnd_Expected).substring(1, 11),
      f : result.recordset[0].JSalary,
      g : result.recordset[0].JDOff,
      h : result.recordset[0].JDescription,
      })
    }
  })
  request.pause();
})

app.post('/create-new-recruiment/confirm', (req,res)=>{
  if (req.isAuthenticated()){
    request.resume();
    request.query(`INSERT INTO dbo.Recruitment_Job VALUES(
      ${req.user.AID}
      ,N'${req.body.a}'
      ,N'${req.body.b}'
      ,N'${req.body.c}'
      ,'${req.body.d}'
      ,'${req.body.e}'
      ,${req.body.f}
      ,${req.body.g}
      ,N'${req.body.h}'
    )`,(err,result)=>{
      if(err){
        console.log(err);
        res.send(false);
      }
      else{
        res.send(true);
      }
    })
    request.pause();
  }
})

app.post('/request-delete-recruit/confirm', (req,res,next)=>{
  request.resume();
  request.query(`DELETE dbo.Recruitment_Job WHERE JID = ${req.body.id}`, (err,result)=>{
    if(err){
      console.log(err);
      res.send(false);
    }
    else{
      res.send(true);
    }
  })
  request.pause();
})

app.post('/get-sch-account/post-confirm', (req,res,next)=>{
  if (req.isAuthenticated()){
    if (req.user.AType == 1){
      res.send(false)
    }
    else{
      res.send(true)
    }
  }
  else{
    res.send(false)
  }
})
// -------------------------------------------------HẾT CỦA LONG---------------------------------------------------------------