var express = require("express");
var app = express();

app.use(express.static(__dirname + "/static"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("index")
});

var server = app.listen(1337, function(){
	console.log("-------------------");
	console.log("-------1337--------");
	console.log("-------------------");
});

var io = require("socket.io").listen(server);

var users = [];
var chats = [];

io.sockets.on('connection', function(socket){
	console.log("sockets");
	console.log("socket id: " + socket.id);

	//user joining
	socket.on("user_joining", function(data){
		// console.log(data);
		users[socket.id] = data.name;
		// console.log(users);
		socket.emit("display_chats", {msgs: chats});
		io.emit("user_joined", {name: data.name});
	})

	//receving message
	socket.on("sending_msg", function(data){
		console.log(data);
		chats.push({name: users[socket.id], msg: data.msg});
		console.log(chats);
		io.emit("msg_received", chats[chats.length-1]);
	})

	socket.on("disconnect", function(){
		io.emit("user_disconnected", {name: users[socket.id]});
		delete users[socket.id];
		console.log(users);
	})

})