const usernameCookie = getCookie('username');

if(usernameCookie !== ""){
  setCookie('username',usernameCookie,7);

  switch (window.location.pathname) {
    case "/":
      window.location = window.location.origin + "/whiteboard";
      break;
    case "/whiteboard":
      initDrawingSocket();
      addLoginInfo(usernameCookie);
      break;
    case "/chat":
      initChattingSocket();
      addLoginInfo(usernameCookie);
      break;
    default:
      window.location = window.location.origin + "/whiteboard";
      break;
  }

}
else if(window.location.href !== window.location.origin + "/"){
  window.location = window.location.origin;
}
