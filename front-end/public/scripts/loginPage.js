const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("nameInput");

loginForm.addEventListener("submit",loginFunction);

function loginFunction(e){
  e.preventDefault();
  const usernameInput = nameInput.value;
  if(!isNullOrWhiteSpace(usernameInput)){
    setCookie('username',usernameInput,7)
    window.location = window.location.origin + "/whiteboard";
  }
}

//
// let username = usernameCookie;
// let drawingSocket;
// let chattingSocket;
//
// if(username === ""){
//   loginScreen.style.display = "block";
//   mainContainer.style.display = "none";
// }
// else{
//   loginScreen.style.display = "none";
//   mainContainer.style.display = "block";
//   setCookie('username',username,7)
//   addLoginInfo();
//   initDrawingSocket();
//   initChattingSocket();
// }
//
//
