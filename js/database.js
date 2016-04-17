
function searchTask(term,keyword, callback){
  console.log("This is search task");
  var keywords = keyword.split(" ");
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  taskRef.orderByChild("Taken").equalTo("0").on("value", function(snapshot) {
     var searchResult = [];
     snapshot.forEach(function(childSnapshot) {
     console.log(childSnapshot);

        var temp = JSON.stringify(childSnapshot.val());
        console.log(temp);
        if(keywords){
          flag=0;
          for(i=0;i<keywords.length;i++)
          {
            var n = temp.search(keywords[i]);
            if(n>-1){
              flag=0;
            }
            else
            {
              console.log("Not matched");
              flag=1;
              break;
            }
          }
          if(flag==0)
            searchResult.push(childSnapshot);
        }
      });
     console.log(searchResult);

      callback(searchResult);
  });
}
function allTasks(zipcode, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  taskRef.orderByChild("Taken").equalTo("0").on("value", function(snapshot) {

     var searchResult = [];
     snapshot.forEach(function(childSnapshot) {
        var temp = JSON.stringify(childSnapshot.val());
        if(zipcode){
          var n = temp.search(zipcode);
          if(n>-1){
            searchResult.push(childSnapshot);

          }
        }
        else{
         searchResult.push(childSnapshot);
        }
      });
     console.log(searchResult);

      callback(searchResult);
  });
}
function createTask(){ 
        var title = document.getElementById('titleTask').value;
        var description = document.getElementById('description').value;
        var zipcode = document.getElementById('zipcode').value;

                                           //Event details from front end
        ref.child("Tasks").push({
                "UID" : ref.getAuth().uid,
                "Title" : title,
                "Description" : description,
                "ZipCode" : zipcode,
                "Taken"  : "0",
                "Finished" : "0"
         });
        alert("New task successfully created");
        sendNotifications(zipcode, title, description, true);
        window.location.href = "../index0.html";
}
sendNotifications("27606","da","da", false);
function sendNotifications(zipcode, title, description, flag)
{
  console.log("sending notifications" + zipcode);
  var notification = new Firebase(FIRE_BASE_URL+ "notification/");
  notification.orderByChild("zipcode").equalTo(zipcode).on("value", function(snapshot) {
    snapshot.forEach(function(data){
      console.log(data.val().phoneNumber);
      if(flag)
      sendMessageNewTask(data.val().phoneNumber, title, description);
    });
  });
}
function sendMessageNewTask(phoneNumber, title, description) {
  console.log(phoneNumber);

var username = "t-kmdkcs2ivvhcoowndivo6nq";
var password = "5zpzwm5bbi3aihgrx2ke4o34ttytwziqoacz6eq";
var userid = "u-iuf2lgg4vx2ttgrdk7jtejq";
var from = "+17473343798";
var to = phoneNumber;

function make_base_auth(user, password) {
 var tok = user + ':' + password;
 var hash = btoa(tok);
 return "Basic " + hash;
}

var data = { "from": from,
            "to": to,
            "text": "Help. Title: " + title + " Dsc: " + description }
  $.ajax({
    type: 'POST',
    headers: {"Authorization": make_base_auth(username, password),
        "Content-Type": "application/json" },    
       url: "https://api.catapult.inetwork.com/v1/users/" + userid + "/messages",
       crossDomain:true,
       data: JSON.stringify(data),
    async: false,
  });
}
// function saveTask(task, callback){
//   ref.child("Tasks").push(task);
//   var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
//   task.forEach(function(object){
//     taskRef.update(object, callback);
//   });
// }
  
function takeTask(uid, requestID, callback){
  console.log("Taking task" + requestID)
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE+requestID);
  taskRef.update({"Taken":uid, "Overdue":"No"}, callback);
}
function overdueTrue(requestID, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE+requestID);
  taskRef.update({"Overdue":"Yes"}, callback);
}
function untakeTask(uid, requestID, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE+requestID);
  taskRef.once('value',function(data){
    if(data.val().Overdue == "No")
    {
      var userRef = new Firebase(FIRE_BASE_URL+USERS_TABLE+uid);
      userRef.once('value', function(data) {
        console.log("Takin away task");
    var trustLevel = data.val().trustLevel;
    trustLevel--;
    userRef.update({"trustLevel":trustLevel},callback);
    });
   }
  });
  taskRef.update({"Taken":"0","Overdue":"No"}, callback);
}
function completeTask(uid, requestID, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE+requestID);
  taskRef.update({"Finished":uid}, callback);
  var userRef = new Firebase(FIRE_BASE_URL+USERS_TABLE+uid);
  userRef.once('value', function(data) {
    var trustLevel = data.val().trustLevel;
    trustLevel++;
    userRef.update({"trustLevel":trustLevel},callback);
  });
}

/*function getBorrowedBooks(uid, callback){
  var return_data = [];
  var bookRef = new Firebase(FIRE_BASE_URL+BOOKS_TABLE);
  bookRef.orderByChild("borrow_uid").equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data){
      return_data.push(data.val());
    });
    callback(return_data);
  });
}
*/

function getMyTasks(uid, callback){
  var return_data = [];
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  taskRef.orderByChild("Taken").equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data){
      if(data.val().Finished == "0")
      return_data.push(data);
    });
    console.log(return_data);
    callback(return_data);
  });
}

function getCompletedTasks(uid, callback){
  var return_data = [];
  var bookRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  bookRef.orderByChild("Finished").equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data){
      return_data.push(data);
    });
    callback(return_data);
  });
}

function getUser(uid, callback){
var user_data = [];
var userRef = new Firebase(FIRE_BASE_URL+USERS_TABLE+uid);

userRef.once('value', function(data) {
	//console.log(data.val());
  user_data.push(data.val());
	callback(user_data);
	});
}

// function getAllTasks(callback){
//   var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
//   taskRef.orderByChild("Priority").on("value", function(snapshot) {

//      var searchResult = [];
//      snapshot.forEach(function(childSnapshot) {
//         var temp = JSON.stringify(childSnapshot.val());
//         if(disaster){
//           var n = temp.search(disaster);
//           if(n>-1){
//             searchResult.push(childSnapshot);

//           }
//         }
//         else{
//          searchResult.push(childSnapshot);
//         }
//       });
//      console.log(searchResult);

//       callback(searchResult);
//   });
// }