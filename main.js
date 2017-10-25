var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var request = require('request');
var rooms   = {};

var questions = require('./server/routes/questions');

app.use(express.static('public'));
app.use('/api/questions', questions);


app.get('/', (req, res) => {
  res.sendFile('public/index.html');
})


io.on('connection', (socket) => {

  let roomid;
  socket.on('hello', (data) => {
    io.emit('hello', 'Se conectó ' + data);

    let id = getRoomToJoin(socket.id);
    roomid = id;
    let user = {
      id: socket.id,
      name: data
    };

    socket.join(id);

    if(id == socket.id){
      rooms[socket.id] = {
        users: [user]
      }
      socket.emit('waiting', {message: 'Esperando oponente...', rooms: rooms});
    } else {
      rooms[id].users.push(user);
      getQuestionsAndPlay(id);
    }
  });

  socket.on('results', (data) => {
    socket.broadcast.to(roomid).emit('results', data);
  })


});

function getRoomToJoin(id){
  let joined = false;
  let ret = id;
  Object.keys(rooms).map((k) => {
    if(rooms[k].users.length == 1 && !joined)
      ret = k;
  });
  return ret;
}

function getQuestionsAndPlay(id){
  console.log('response request');
  request('http://localhost:8080/api/questions', (error, response, questions) => {
    console.log(rooms[id].users);
    io.in(id).emit('play', {message: 'Se comienza a jugar.', questions, users: rooms[id].users});
  });
}

server.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});
