const baseurl = BASE_URL;

async function postMessage() {
  const token = localStorage.getItem("token");
  const message = document.getElementById("message-input").value;

  const obj = { message };
  const { data: newMessage } = await axios.post(
    `${baseurl}/chat-box/message`,
    obj,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  window.location.reload();
}
