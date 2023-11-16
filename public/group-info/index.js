const baseurl = BASE_URL;

document.addEventListener("DOMContentLoaded", () => {
  listMembers();
});

async function listMembers() {
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");
  //need to take out admin details

  const {
    data: { adminStatus, members },
  } = await axios.post(
    `${baseurl}/group-info/group-members`,
    { groupId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(adminStatus);
  console.log(members);

  members.forEach((member) => addToMembers(member, adminStatus));
}

function addToMembers(singleMember, adminStatus) {
  const groupMembersDiv = document.getElementById("group-members-div");
  const singleMemberDiv = document.createElement("div");
  singleMemberDiv.className = "single-member-div";
  const nameDiv = document.createElement("div");
  const emailDiv = document.createElement("div");
  nameDiv.innerHTML = `<b>${singleMember.user.name}</b>`;
  emailDiv.innerHTML = `${singleMember.user.email}`;
  nameDiv.classList = "text-div";
  emailDiv.className = "text-div";
  singleMemberDiv.appendChild(nameDiv);
  singleMemberDiv.appendChild(emailDiv);
  
  if (adminStatus) {
    const removeButtonDiv = document.createElement("div");
    removeButtonDiv.className = "remove-button-div";
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButtonDiv.appendChild(removeButton);

    removeButton.addEventListener("click", removeMember);

    const isMemberAdmin = singleMember.admin;

    const makeAdminButtonDiv = document.createElement("div");
    makeAdminButtonDiv.className = "make-admin-button-div"
    if (isMemberAdmin) {
      makeAdminButtonDiv.innerHTML = `<b>Admin</b>`;
    } else {
      const makeAdminButton = document.createElement("button");
      makeAdminButton.textContent = "Make admin";
      makeAdminButtonDiv.appendChild(makeAdminButton);

      makeAdminButton.addEventListener("click", makeAdmin);
    }

    singleMemberDiv.appendChild(makeAdminButtonDiv);
    singleMemberDiv.appendChild(removeButtonDiv);

    async function makeAdmin() {
      const token = localStorage.getItem("token");
      const groupId = localStorage.getItem("groupId");
      const memberId = singleMember.user.id;
      const obj = { groupId, memberId };

      const { data } = await axios.post(
        `${baseurl}/group-info/make-admin`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);
    }

    async function removeMember() {
      const token = localStorage.getItem("token");
      const groupId = localStorage.getItem("groupId");
      const memberId = singleMember.user.id;
      const obj = { groupId, memberId };

      const {
        data: { message },
      } = await axios.post(`${baseurl}/group-info/remove-member`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(message);
    }
  }

  groupMembersDiv.appendChild(singleMemberDiv);
}
