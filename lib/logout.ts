/** Clears the local session and redirects the user to login. */
/** Removes the local authentication data and redirects to the login page. */
export function logout(router?: any) {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  if (router) {
    router.replace("/login")
  } else {
    window.location.href = "/login"
  }
}
