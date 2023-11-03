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
    const {data} = await axios.post(`${baseurl}/signup`, obj);
    alert("Successfully signed up!!")
  } catch (error) {
    if (error.response.status === 403) {
      emailError.textContent = "*This email is already registered";
    }
  }
}
