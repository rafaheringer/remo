
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , os = require('os')
  , url = require('url')
  , colors = require('colors')
  , path = require('path');

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.configure(function(){
  app.use(allowCrossDomain);
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/');
  app.set('view engine', 'html');
  app.engine('html', require('ejs').renderFile);            //Usa EJS com extensão .html
  app.use(express.static(path.join(__dirname, '/player')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Configurações apenas para o HEROKU
//io.configure(function () { 
  //io.set("transports", ["xhr-polling"]); 
  //io.set("polling duration", 10); 
//});

//Production config
// io.enable('browser client minification');
// io.enable('browser client etag');
// io.enable('browser client gzip');
// io.set('log level', 1);

//Rotas
app.get('/',  function(req, res){
  res.render('player/masterPlayer/index.html');
  app.set('hostname', ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host);
});

app.get('/remote/:ID', function(req, res){
  res.render('player/controlPlayer/index.html');
});

server.listen(app.get('port'), function(){
  console.log('Server started at ' + os.hostname() + ':' + app.get('port'));
});

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
      //Send message: good connection
      socket.emit('message', {
        code: 'connect',
        hostname: os.hostname(),
        port: app.get('port'),
        url: app.get('hostname')
      });

      //From cp (Control Player) to mp (Master Player)
      socket.on('mp', function(m) {
        if(PLAYER[m.playerId])
          PLAYER[m.playerId].socket.emit('message-mp', m);
      });

      //From mp (Master Player) to cp (Control Player)
      socket.on('cp', function(m) {
        if(PLAYER[m.playerId + 'r'])
          PLAYER[m.playerId + 'r'].socket.emit('message-cp', m);
      });


      socket.on('message', function(data){
        //Verify ID from Control Player
        if(data.playerId == ('undefined' || 'null' || null || '')) {
          socket.emit('authenticateMessage', {code: '001', message: 'Authenticate failed.'});
          console.error('Authenticate failed. PlayerId is not defined.'.red);
          return false;
        }

        //From Master Player
        if(data.from == 'mp') {

          //Set ID
          PLAYER[data.playerId] = {
            socketID: socket.id,
            socket: socket
          };
        }

        //From Control Player
        else if(data.from == 'cp') {
          //Set ID
          PLAYER[data.playerId + 'r'] = {
            socketID: socket.id,
            socket: socket
          };
        }

        //Verify registered Master Player ID
        if(!PLAYER[data.playerId]) {
          socket.emit('authenticateMessage', {code: '001', message: 'Authenticate failed.'});
          console.error('Authenticate failed. The Master Player with this playerId not exist.'.red);
          return false;
        }

        console.log('User authenticated. Player id: ' + data.playerId + ' Socket: ' + PLAYER[data.playerId].socketID);
        socket.emit('authenticateMessage', {code: '000', socketID: PLAYER[data.playerId].socketID});
      });

      //Music Control
      socket.on('musicControl', function(data){
        //Have ID?
        if(data.to == ('undefined' || 'null' || null || '')) {
          socket.emit('message', {code: '001', message: 'O ID retornou nulo ou indefinido'});
          return false;
        }

        //Envia ação
        PLAYER[data.to].socket.emit('musicControl', data);
      });
    });