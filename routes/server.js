var express = require('express');
var router = express.Router;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views','../views');
app.set('view engine','pug');
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    res.render('chat');
});

var count=1;
//사용자가 채팅페이지에 접속했을때
io.on('connection',function (socket){
     console.log('user connected',socket.id);
     var name = "익명"+count++;
    socket.name = name;
     io.to(socket.id).emit('create name',name);
     io.emit('new_connect',name);

     socket.on('disconnect',function (){
         console.log('user disconnected : '+ socket.id + ' '+ socket.name);
         io.emit('new_disconnect',socket.name);
     })

    socket.on('send message',function (name,text){
        var msg = name + ' : ' + text;
        if(name != socket.name)
            io.emit('change name',socket.name,name);
        socket.name = name;
         console.log(msg);
         io.emit('receive message',msg);
    });
});

http.listen(3000,function (){
    console.log('server on..');
});

module.exports = router;