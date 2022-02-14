var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'mydata'
});

conn.connect();

// db 객체를 main.js에서 사용할 수 있게 모듈로 export 하기
module.exports = conn;

// cmd 창에 user_info 테이블에 있는 정보를 보여줌
conn.query('SELECT * FROM user_info', function(error, results, fields){
    if (error){
        console.log(error);
    }
    console.log(results);
});

conn.end();

/*
module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}
*/