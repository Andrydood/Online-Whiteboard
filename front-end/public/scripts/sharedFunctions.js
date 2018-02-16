const userStatus = document.getElementById("userStatus");
const ip = "localhost";

function isNullOrWhiteSpace(str) {
  return (!str || str.length === 0 || /^\s*$/.test(str));
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function deleteCookie(cname) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookiesAndRefreshPage() {
  deleteCookie("username");
  window.location = window.location.origin;
}

function addLoginInfo(username) {
  const par = document.createElement("p");
  const loggedInText = document.createTextNode(`Logged in as: ${username} `);
  const link = document.createElement("p");
  const linkText = document.createTextNode("(change)");
  par.id = "loggedInText";
  link.id = "textLink";
  par.appendChild(loggedInText);
  link.appendChild(linkText);
  link.onclick = deleteCookiesAndRefreshPage;
  userStatus.appendChild(par);
  userStatus.appendChild(link);
}


function displayOnlineUsers(user) {
  const par = document.createElement("p");
  const text = document.createTextNode(user);
  par.appendChild(text);
  userList.appendChild(par);
}
