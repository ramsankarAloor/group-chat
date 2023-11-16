const baseurl = BASE_URL;

document.addEventListener("DOMContentLoaded", () => {
  listMembers();
});

async function listMembers() {
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");
  //need to take out admin details

  const {data : {adminStatus, members}} = await axios.post(
    `${baseurl}/group-info/group-members`, {groupId},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(adminStatus);
  console.log(members);

  members.forEach((member)=>addToMembers(member, adminStatus));
}

function addToMembers(singleMember, adminStatus){
    const groupMembersDiv = document.getElementById("group-members-div");
    const singleMemberDiv = document.createElement('div');
    singleMemberDiv.className = "single-member-div";
    const textDiv = document.createElement('div');
    textDiv.innerHTML = `<b>${singleMember.user.name}</b>`
    singleMemberDiv.appendChild(textDiv);

    if(adminStatus){
        const removeButtonDiv = document.createElement('div');
        const removeButton = document.createElement('button')
        removeButton.textContent = "Remove";
        removeButtonDiv.appendChild(removeButton);

        singleMemberDiv.appendChild(removeButtonDiv);
    }

    groupMembersDiv.appendChild(singleMemberDiv);

}