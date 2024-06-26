const baseurl = BASE_URL;

const loginButton = document.querySelector("button");
const emailfield = document.getElementById("email");
const passwordfield = document.getElementById("password");

loginButton.addEventListener("click", loginSubmit);

async function loginSubmit() {
  const email = emailfield.value;
  const password = passwordfield.value;

  const loginError = document.getElementById("loginError");

  const obj = { email, password };
  try {
    const { data: loginUser } = await axios.post(`${baseurl}/auth/login`, obj);
    localStorage.setItem("token", loginUser.accessToken);
    window.location.href = "../chat-app-window/index.html";
  } catch (error) {
    if (error.response.status === 404) {
      loginError.textContent = "Error ! User not found..";
    } else if (error.response.status === 401) {
      loginError.textContent = "Error ! Wrong password..";
    } else if (error.response.status === 400) {
      loginError.textContent = "Enter inputs..!";
    }
  }
}
