//helper functions to get data from a user session
function getToken() {

  return localStorage.getItem("token");
}
export default getToken;

function getEmail() {

  return localStorage.getItem("email")
}
