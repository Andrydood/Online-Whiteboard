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
