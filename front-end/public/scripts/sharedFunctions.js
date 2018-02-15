const userStatus = document.getElementById("userStatus");
const ip = "10.134.214.147";

function isNullOrWhiteSpace(str) {
  return (!str || str.length === 0 || /^\s*$/.test(str));
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function addLoginInfo(username){
  const par = document.createElement('p');
  const loggedInText = document.createTextNode('Logged in as: '+ username +' ')
  const link = document.createElement('p');
  const linkText = document.createTextNode('(change)')
  par.appendChild(loggedInText);
  link.appendChild(linkText);
  link.classList.add("textLink");
  link.onclick = deleteCookiesAndRefreshPage;
  userStatus.appendChild(par);
  userStatus.appendChild(link);
}

function deleteCookiesAndRefreshPage(){
  deleteCookie('username');
  window.location = window.location.origin;
}
