const baseurl = BASE_URL;

const signupButton = document.querySelector("button");
const namefield = document.getElementById("name");
const emailfield = document.getElementById("email");
const passwordfield = document.getElementById("password");

signupButton.addEventListener("click", signupSubmit);

async function signupSubmit() {
  const name = namefield.value;
  const email = emailfield.value;
  const password = passwordfield.value;

  const emailError = document.getElementById("emailError");

  const obj = { name, email, password };
  try {
    await axios.post(`${baseurl}/signup`, obj);
    const { data: loginUser } = await axios.post(`${baseurl}/login`, {
      email,
      password,
    });
    localStorage.setItem("token", loginUser.accessToken);
    window.location.href = "../chat-app-window/index.html";
  } catch (error) {
    if (error.response.status === 403) {
      emailError.textContent = "*This email is already registered";
    }
  }
}
