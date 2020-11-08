//helper functions to get data from a user session
export function getToken() {

  return localStorage.getItem("token");
}

export function getEmail() {

  return localStorage.getItem("email");
}

