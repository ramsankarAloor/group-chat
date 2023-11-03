const baseurl = BASE_URL;

const loginButton = document.querySelector("button");
const emailfield = document.getElementById("email");
const passwordfield = document.getElementById("password");

signupButton.addEventListener("click", loginSubmit);

async function loginSubmit() {
  const email = emailfield.value;
  const password = passwordfield.value;

  const emailError = document.getElementById("emailError");

  const obj = { email, password };
  try {
    const {data} = await axios.post(`${baseurl}/login`, obj);
    localStorage.setItem("token", data.accessToken);
    alert("Successfully logged in!!")
  } catch (error) {
    if (error.response.status === 404) {
        loginError.textContent = "Error ! User not found..";
      } else if (error.response.status === 401) {
        loginError.textContent = "Error ! User not authorized..";
      }
  }
}
