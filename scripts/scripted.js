var nameofperson="Anonymous";

var is_set=false;


const socket = io('/');

var videostream;
const area=document.getElementById("grid");//for the grid 
//console.log(area);
const myvideo=document.createElement("video");



const peer=new Peer(undefined);
myvideo.muted=true;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true   
}).then(function(stream){
    //console.log("Access granted");
    videostream=stream;
    var person = prompt("Please enter your name", "Anonymous");

    if (person != null) 
    {
        nameofperson=person;
    }
    //console.log("Bs");
    showstream(myvideo,stream);
    peer.on("call",function(call)
    {
        call.answer(stream);
        var video=document.createElement("video");
        call.on("stream",function(newstream)
        {
            showstream(video,newstream);
        }); 
    });
    socket.on("user-connected", function(urid) {
        /*setTimeout(() => {
          console.log("FFGF");
          connectnew(urid, stream)
          console.log("POLOL");
        }, 300)*/
        connectnew(urid,stream);
      })
    });
peer.on("open",function(urid)
{
    socket.emit("joined-room",ID,urid);
});

function connectnew(urid,stream)
{
    const video=document.createElement("video");
    const call=peer.call(urid,stream);
    call.on("stream",function(userVideoStream)
        {
            showstream(video,userVideoStream);
        });
    console.log(urid);
};
function showstream(video,stream)
{
    video.srcObject=stream;
    video.addEventListener("loadedmetadata",function()
    {
        video.play();
        //console.log("Video playing");
    });
    area.append(video);
}

var msg=$("input");


$("html").keydown(function(event)
{
    if(event.which==13 && msg.val().length>0)
        {
            socket.emit("entered",msg.val(),nameofperson);
            msg.val("");
        }
});

socket.on("createmsg",function(msg,username){
    $("ul").append(`<li class=messages><b>${username} says</b><br>${msg}</li>`);
    GoDown();
});
function GoDown()
{
    var grabber=$(".messsagewindow");
    grabber.scrollTop(grabber.prop("scrollHeight"));
}

function Togglemute()
{
    var current_state=videostream.getAudioTracks()[0].enabled;
    if(current_state==false)
    {
        videostream.getAudioTracks()[0].enabled=true;
        setmute();
    }
    else
    {
        videostream.getAudioTracks()[0].enabled=false;
        setunmute();
    }
}
function setmute()
{
    document.querySelector(".Mutebuton").innerHTML=`<i class="fas fa-microphone"></i>
    <span>Mute</span>`
}

function setunmute()
{
    document.querySelector(".Mutebuton").innerHTML=`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
}
function Togglevideo()
{
    var current_state=videostream.getVideoTracks()[0].enabled;
    if(current_state==false)
    {
        videostream.getVideoTracks()[0].enabled=true;
        turnoff();
    }
    else
    {
        videostream.getVideoTracks()[0].enabled=false;
        turnon();
    }
}
function turnoff()
{
    document.querySelector(".Videobutton").innerHTML=`<i class="fas fa-video"></i>
    <span>Turn video off</span>`
}

function turnon()
{
    document.querySelector(".Videobutton").innerHTML=`
    <i class="unmute fas fa-video-slash"></i>
    <span>Turn video on</span>
  `
}

function Leave()
{
    videostream.getVideoTracks()[0].enabled=false;
    window.location.href="left/left"
}