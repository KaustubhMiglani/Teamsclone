const express=require("express");
const app=express();
app.set("views", "Frontends");
app.set("view engine","ejs");
const {v4: uuidv4}=require("uuid");
const for_server=require("http");
const server=for_server.Server(app);
const io=require("socket.io")(server);
app.use(express.static("scripts"));
const {ExpressPeerServer}=require("peer");
const peerserver=ExpressPeerServer(server,
{
    debug:true
});
app.use("/peerjs",peerserver);
app.get('/',function(req,res){
    res.redirect(`/${uuidv4()}`);
});
app.get("/:room",function(req,res){
    res.render("Room_id",{Id:req.params.room});
});
app.get("/:left/:left",function(req,res)
{
    res.render("Leave_screen");
});
io.on("connection",function(socket){
    socket.on("joined-room",function(ID,urid)
    {
        socket.join(ID);
        console.log("Works");
        //console.log(socket.to(ID).broadcast);
        socket.broadcast.to(ID).emit("user-connected",urid);
        //console.log("room joined");
        //console.log(urid);
        socket.on("entered",function(msg){
            io.to(ID).emit("createmsg",msg);
        });
    });

});
server.listen(3000);