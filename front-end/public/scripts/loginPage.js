const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("nameInput");

// Username can be set as a cookie
function loginFunction(e) {
  e.preventDefault();
  const usernameInput = nameInput.value;
  if (!isNullOrWhiteSpace(usernameInput)) {
    setCookie("username", usernameInput, 7);
    window.location = `${window.location.origin}/whiteboard`;
  }
}

loginForm.addEventListener("submit", loginFunction);
