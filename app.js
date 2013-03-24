
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , routes = require('./routes')
  , remotePlayer = require('./routes/remotePlayer')
  , path = require('path');

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('ejs').renderFile);            //Usa EJS com extensão .html
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Rotas
app.get('/', routes.index);
app.get('/remote/:ID', remotePlayer.index);

/*
 * Configurações do player 
 * ***********************
 */

//Configurações globais
var PLAYER = {
  //socketID: null
};

//IO
io
  .of('/player')
    .on('connection', function(socket){
      socket.on('message', function(data){
        //Verifica ID
        if(data.playerID == ('undefined' || 'null' || null || '')) {
          socket.emit('authenticateMessage', {code: '001', message: 'Autenticação falhou.'});
          return false;
        }

        //Seta ID
        PLAYER[data.playerID] = {
          socketID: socket.id,
          socket: socket
        };
        console.log('Usuário entrou. Player id: ' + data.playerID + ' Socket: ' + PLAYER[data.playerID].socketID);
        socket.emit('authenticateMessage', {code: '000', socketID: PLAYER[data.playerID].socketID});
      });

      //Métodos de controle de música
      socket.on('musicControl', function(data){
        //Verifica se está com ID
        if(data.to == ('undefined' || 'null' || null || '')) {
          socket.emit('message', {code: '001', message: 'O ID retornou nulo ou indefinido'});
          return false;
        }

        //Envia ação
        PLAYER[data.to].socket.emit('musicControl', data);
      });
    });