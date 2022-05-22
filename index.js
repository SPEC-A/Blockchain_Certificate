let express = require('express');
let logger = require('./config/winston');
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
    console.log("Express server has started on port "+ port);
    logger.info('Running')
});

conn.connect(function(err){
    if (err) throw err;
    console.log('Connected');
});

app.get('/userinfo',function(req,res){
    conn.query('SELECT * FROM user_info',function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH')
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send(data);
    });
});

app.get('/certinfo',function(req,res){
    var id = Number(request.param('addr'));
    conn.query('SELECT cert_addr, user_name, user_birth, cert_effective_date, cert_expiration_date, cert_id FROM user_cert_info, user_info WHERE cert_id = user_pubkey AND cert_addr = ?',[id],function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send(data);
        logger.info('Inquire certificate information')
    });
});


app.post('/userinfo', function(req,res){
    var name = req.param('name');
    var birth = req.param('birth');
    var addr = req.param('addr');
    console.log(name);
    conn.query('INSERT INTO user_info(issuer_id, user_name, user_birth, user_pubkey) VALUES(1,?,?,?)',[name,birth,addr], function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send({
            message: '데이터를 추가했습니다.',
        });
        logger.info('user information successfully saved');
    });
});

app.delete('/delete', function(req,res){
    var account = req.param('addr');
    conn.query('DELETE FROM user_info WHERE user_pubkey = ?',[account],function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    });
    conn.query('DELETE FROM user_cert_info WHERE cert_addr = ?',[account],function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send(data);
    });
    logger.info('certificate successfully revoked');
});

app.post('/usercert',function(req,res){
    var cert_addr = req.param('cert_addr');
    var eff = req.param('eff');
    var exp = req.param('exp');
    var id = req.param('id');
    console.log(cert_addr);
    console.log(eff);
    console.log(exp);
    console.log(id);
    conn.query('INSERT INTO user_cert_info(cert_addr, cert_effective_date, cert_expiration_date, cert_id) VALUES(?,?,?,?)',[cert_addr,eff,exp,id],function(err,data){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.send(data);
    });
    logger.info('certificate successfully saved');
});