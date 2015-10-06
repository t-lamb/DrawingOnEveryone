var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http); 


http.listen(8000,function(){

  console.log('Creating Wormholes');
  console.log("hi! 8000");

});

app.use(express.static('public'));

var clientCount = 0;

app.get('/',function(req,res){

  if(clientCount < 16){
    res.sendfile('public/client.html');
  }
  else{
    res.sendfile('public/none.html');
  }

});

var userList = new Array();
var standbyList = new Array();

io.on('connection', function(socket){

   socket.emit('testType','');

   socket.on('newArtist', function(){
   clientCount ++ ;
   newArtist(socket.id);
   console.log("we got a new artist! " + socket.id);   
   });

   socket.on('disconnect', function () {
   lostArtist(socket.id);
   clientCount--;
   });

    //-------Socket_Manager--------//

    //var haha = "test";

    socket.on('frame',function(pack){

      for(i=0; i < userList.length; i++ ){
        if( userList[i].id == pack.token && userList[i].partnerId != "none" ){
           //console.log('-FIND!-');
           //console.log(userList[i].partnerId);
            //console.log(pack.stream);
          io.emit( userList[i].partnerId , pack.stream );
          //io.emit( haha , pack.stream );
        }
        else if(userList[i].partnerId == "none"){
          io.emit('deny',true);
        }
      }

    });

    socket.on('result',function(pack){
      console.log("get still");

      for(i=0; i < userList.length; i++ ){
        if( userList[i].id == pack.token && userList[i].partnerId != "none" ){
          io.emit( userList[i].partnerId + "still" , pack.still );
          console.log("passing still");
        }
        else if(userList[i].partnerId == "none"){
          io.emit('deny',true);
        }
      }

    });

    //------------------------------//

});



//-------user.prototype---------//


//--------Socket_Dynamic_Functions---------//

//New

function newArtist(NewUserID){

    var lostAddress = null;
    var leftPosition = 0;

    for(i=0; i<userList.length; i++){
       //clear_Junk!
     if(userList[i].id == "Free_Pos" && userList[i].partnerId == "none"){
      userList.splice(i,1);
     }
    }

    for(i=0; i<userList.length; i++){
      if(userList[i].id === "Free_Pos"){
        leftPosition++ ;
        lostAddress = i ;
        break;
      }
    }
    
    console.log("leftPos " + leftPosition + " @ " + lostAddress);

    if(leftPosition <= 0 ){

      var artistObject

      if(userList.length < 1){
          artistObject = {
         id : NewUserID,
         partnerId : "none"
        }
      }
    
      else if(userList.length >= 1){
        for(i=0; i < userList.length; i++ ){
          if( userList[i].partnerId == "none" ){
            userList[i].partnerId = NewUserID;

            artistObject = {
               id : NewUserID,
               partnerId : userList[i].id
            }

            break;
          }
     //New----//
          else{

           artistObject = {
            id : NewUserID,
            partnerId : "none"
           }

         }

        }
      }


      userList.push(artistObject);

    }
    else{
    userList[lostAddress].id = NewUserID;
    for(i=0; i < userList.length; i++ ){
          if( userList[i].partnerId == "none" ){

            userList[i].partnerId = NewUserID;

            artistObject = {
               id : NewUserID,
               partnerId : userList[i].id
            }

            break;
          }
        }
      }
      //New------//

    //-------alerts--------//
    console.log("New_Artist---------------");
    console.log(userList);
    console.log("clientCount " + clientCount);

}



//Lost

//Check the lost User
function lostArtist(theLostID){

  console.log(theLostID);

   for(i=0; i < userList.length; i++){
       if( theLostID == userList[i].id ){
         userList[i].id = "Free_Pos";
         }
     }

    for(i=0; i < userList.length; i++){
     if( theLostID == userList[i].partnerId){
        userList[i].partnerId = "none";
       }
     }

    for(i=0; i<userList.length; i++){
       //clear_Junk!
     if(userList[i].id == "Free_Pos" && userList[i].partnerId == "none"){
      userList.splice(i,1);
     }
    }

   console.log(userList);
   console.log("Lost_Artist------Free_Pos");
}


//------------------------------//



//incoming user

//route

//if client! >> client.html (client <= 16);

//>>open socket connection & get socket.id 

//----- if first user, standby

//fill user list --- if (userList.length >= 2)
//use for loop 
//lop 2X
//min (>= 0 && < userList.length) int

//save to object attributes;

//choose from userList, open socket manager listen to 'token'
//Fetching partner, for loop through userList
//send data

//>> add socket.id >> userList

//if disconnect >> get socket.id >> delete from list (userList management)








