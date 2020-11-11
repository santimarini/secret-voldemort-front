import jwtDecode from 'jwt-decode';

//helper functions to get data from a user session
export function getToken() {

  return localStorage.getItem("token");
}

export function getEmail() {

  return jwtDecode(getToken()).sub;
}

export function getAlias() {

  return localStorage.getItem("alias");
}
