const usernameCookie = getCookie("username");

// If any page is reached, it checks for the username cookie
// If cookie is not there, user is taken to page where username can be set,
// so cookie is generated
// If cookie is there, cookie is refreshed and user is sent to their wanted
// page or default to whiteboard
if (usernameCookie !== "") {
  setCookie("username", usernameCookie, 7);

  switch (window.location.pathname) {
    case "/":
      window.location = `${window.location.origin}/whiteboard`;
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
      window.location = `${window.location.origin}/whiteboard`;
      break;
  }
} else if (window.location.href !== `${window.location.origin}/`) {
  window.location = window.location.origin;
}
