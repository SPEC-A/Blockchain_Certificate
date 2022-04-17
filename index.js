let express = require('express');
let app = express();
let router = require('./router/main')(app);
let port = process.env.PORT || 3000;
let bodyParser = require('body-parser')
let db = require('./database.js');
let conn = db.init();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

let server = app.listen(port, function(){
    console.log("Express server has started on port "+ port)
});

conn.connect(function(err){
    if (err) throw err;
    console.log('Connected');
})

app.get('/userinfo',function(req,res){
    conn.query('SELECT * FROM user_info',function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send(data);
    })
});

app.post('/userinfo', function(req,res){
    var name = req.param('name');
    var birth = req.param('birth');
    var addr = req.param('addr')
    console.log(name);
    conn.query('INSERT INTO user_info(issuer_id, user_name, user_birth, user_pubkey) VALUES(1,?,?,?)',[name,birth,addr], function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send({
            message: '데이터를 추가했습니다.',
        });
    });
});