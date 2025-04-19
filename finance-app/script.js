let currentUser = null;
let totalFunds = 0;
let transactionHistory = [];
let editingTransactionId = null;

function loadMembers() {
  fetch('get_members.php?t=' + new Date().getTime())
    .then(res => res.json())
    .then(members => {
      const loginSelect = document.getElementById("member-select");
      const chatSelect = document.getElementById("chat-with-select");

      
      loginSelect.innerHTML = '<option value="">Select Member</option>';
      chatSelect.innerHTML = '<option value="">Select Member</option>';

      
      const everyoneOption = document.createElement("option");
      everyoneOption.value = "everyone";
      everyoneOption.textContent = "Everyone";
      chatSelect.appendChild(everyoneOption);
      

      members.forEach(member => {
        const option = document.createElement("option");
        option.value = member;
        option.textContent = member;
        loginSelect.appendChild(option);

        if (member !== currentUser) {
          const chatOption = option.cloneNode(true);
          chatSelect.appendChild(chatOption);
        }
      });
    })
    .catch(err => console.error("Error loading members:", err));
    
}

window.onload = loadMembers;

function toggleSignup() {
  const signupSection = document.getElementById("signup-section");
  signupSection.classList.toggle("hidden");
}

function signup() {
  const name = document.getElementById("new-member-name").value.trim();
  const password = document.getElementById("new-member-password").value;

  if (!name || !password) {
    alert("Please enter both name and password.");
    return;
  }

  fetch('signup.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      alert("Signup successful! Please login.");
      toggleSignup();
      loadMembers();
    } else {
      alert("Signup failed: " + data.message);
    }
  })
  .catch(err => {
    console.error("Signup error:", err);
    alert("Signup error.");
  });
}

function login() {
  const member = document.getElementById("member-select").value;
  const password = document.getElementById("password").value;

  if (!member || !password) {
    alert("Please enter name and password.");
    return;
  }

  fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: member, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      currentUser = member;
      document.getElementById("user-name").innerText = currentUser;
      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      loadMembers();
      loadTransactions();
      renderSplitCheckboxes();
    } else {
      alert(data.message);
    }
  })
  .catch(err => {
    console.error("Login error:", err);
    alert("Login error.");
  });
}

function logout() {
  currentUser = null;
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
}

function submitTransaction() {
  const type = document.getElementById("action-type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value.trim();

  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  if (isNaN(amount) || amount <= 0 || !description) {
    alert("Please enter a valid amount and description.");
    return;
  }

  saveTransaction(currentUser, type, amount, description);

  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
}

function saveTransaction(user, type, amount, description) {
  fetch('add_transaction.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, type, amount, description })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      loadTransactions();
    } else {
      alert("Error saving transaction: " + data.message);
    }
  });
}

function loadTransactions() {
  fetch('get_transactions.php')
    .then(res => res.json())
    .then(data => {
      transactionHistory = data;
      totalFunds = 0;

      transactionHistory.forEach(tx => {
        if (tx.type === "donate") totalFunds += parseFloat(tx.amount);
        else if (tx.type === "withdraw") totalFunds -= parseFloat(tx.amount);
      });

      document.querySelector(".total-funds-display").style.display = "block";
      updateFundsDisplay();
      renderHistory();
      showFundSummary(); 
    })
    .catch(error => {
      console.error("Error loading transactions:", error);
    });
}

function showFundSummary() {
  let totalDonated = 0;
  let totalWithdrawn = 0;

  transactionHistory.forEach(tx => {
    if (tx.type === "donate") totalDonated += parseFloat(tx.amount);
    else if (tx.type === "withdraw") totalWithdrawn += parseFloat(tx.amount);
  });

  document.getElementById("donatedAmount").textContent = `Total Donated: Rs. ${totalDonated.toFixed(2)}`;
  document.getElementById("withdrawnAmount").textContent = `Total Withdrawn: Rs. ${totalWithdrawn.toFixed(2)}`;
}







function updateFundsDisplay() {
  const totalFundsElement = document.getElementById("total-funds");
  if (totalFundsElement) {
    totalFundsElement.innerText = totalFunds.toFixed(2);
  } else {
    console.error("Missing element: total-funds");
  }
}

function deleteTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  fetch('delete_transaction.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      alert("Transaction deleted!");
      loadTransactions();
    } else {
      alert("Error deleting: " + data.message);
    }
  });
}

function renderHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  if (transactionHistory.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No transactions yet.";
    li.style.fontStyle = "italic";
    historyList.appendChild(li);
    return;
  }

  transactionHistory.forEach((tx, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${tx.user} ${tx.type === "donate" ? "donated" : "withdrew"} Rs. ${tx.amount} on ${tx.time} - ${tx.description}
      ${tx.user === currentUser ? `
        <button onclick="editTransaction(${index})" class="edit-btn">Edit</button>
        <button onclick="deleteTransaction(${tx.id})" class="delete-btn">Delete</button>
      ` : ''}
    `;
    historyList.appendChild(li);
  });
}

function editTransaction(index) {
  const tx = transactionHistory[index];

  if (tx.user !== currentUser) {
    alert("You can only edit your own transactions.");
    return;
  }

  document.getElementById("amount").value = tx.amount;
  document.getElementById("description").value = tx.description;
  document.getElementById("action-type").value = tx.type;
  editingTransactionId = tx.id;

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.innerText = "Update";
  submitBtn.onclick = updateTransaction;
}

function updateTransaction() {
  const type = document.getElementById("action-type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value.trim();

  if (!editingTransactionId) {
    alert("No transaction selected for editing.");
    return;
  }

  if (isNaN(amount) || amount <= 0 || !description) {
    alert("Please enter a valid amount and description.");
    return;
  }

  fetch('update_transaction.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: editingTransactionId,
      user: currentUser,
      type,
      amount,
      description
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      alert("Transaction updated!");
      editingTransactionId = null;

      document.getElementById("amount").value = "";
      document.getElementById("description").value = "";
      document.getElementById("action-type").value = "donate";

      const submitBtn = document.getElementById("submit-btn");
      submitBtn.innerText = "Submit";
      submitBtn.onclick = submitTransaction;

      loadTransactions();
    } else {
      alert("Update failed: " + data.message);
    }
  });
}

function resetForm() {
  editingTransactionId = null;
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("action-type").value = "donate";

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.innerText = "Submit";
  submitBtn.onclick = submitTransaction;
}

function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,User,Type,Amount,Description,Time\n";
  transactionHistory.forEach(tx => {
    csvContent += `${tx.user},${tx.type},${tx.amount},${tx.description},${tx.time}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transaction_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function sendMessage() {
  if (!currentUser) {
    alert("You must be logged in to send messages.");
    return;
  }

  const receiver = document.getElementById("chat-with-select").value;
  const message = document.getElementById("chat-input").value.trim();

  if (!receiver || !message) {
    alert("Choose a member and write a message");
    return;
  }

  fetch("send_message.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: currentUser, receiver, message })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("chat-input").value = "";
      loadMessages(receiver);
    } else {
      alert("Message send failed: " + data.message);
    }
  })
  .catch(err => {
    console.error("Send message error:", err);
    alert("Error sending message.");
  });
}

function populateMembers() {
  const memberSelect = document.getElementById("member-select");
  const chatSelect = document.getElementById("chat-with-select");

  
  memberSelect.innerHTML = `<option value="">Select Member</option>`;
  chatSelect.innerHTML = `<option value="everyone">Everyone</option>`;

  
  for (let name in members) {
    const option1 = document.createElement("option");
    option1.value = name;
    option1.textContent = name;
    memberSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = name;
    option2.textContent = name;
    chatSelect.appendChild(option2);
  }
}






function loadMessages(receiver) {
  fetch(`get_messages.php?sender=${currentUser}&receiver=${receiver}`)
    .then(res => res.json())
    .then(messages => {
      const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = "";

      messages.forEach(msg => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.message} <span style="font-size: 10px;">(${msg.timestamp})</span>`;
        chatBox.appendChild(div);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(err => {
      console.error("Load messages error:", err);
    });
}

document.getElementById("chat-with-select").addEventListener("change", function () {
  const selected = this.value;
  if (selected) loadMessages(selected);
});


setInterval(() => {
  const receiver = document.getElementById("chat-with-select").value;
  if (receiver) loadMessages(receiver);
}, 10000);

function calculateSplit() {
  const total = parseFloat(document.getElementById('totalAmount').value);
  const checkboxes = document.querySelectorAll('input[name="split-member"]:checked');
  const results = document.getElementById('results');

  if (isNaN(total) || total <= 0) {
    results.innerHTML = "<p style='color:red;'>Please enter a valid total amount.</p>";
    return;
  }

  if (checkboxes.length === 0) {
    results.innerHTML = "<p style='color:red;'>Please select at least one member.</p>";
    return;
  }

  const perMember = (total / checkboxes.length).toFixed(2);

  let html = `<p>Total: Rs. ${total.toFixed(2)}</p>`;
  html += `<p>Split among ${checkboxes.length} member(s):</p><ul>`;
  checkboxes.forEach(cb => {
    html += `<li>${cb.value}: Rs. ${perMember}</li>`;
  });
  html += "</ul>";

  results.innerHTML = html;
}

function renderSplitCheckboxes() {
  fetch('get_members.php')
    .then(res => res.json())
    .then(members => {
      const list = document.getElementById("split-members-list");
      list.innerHTML = ""; 

      members.forEach(member => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="split-member" value="${member}"> ${member}`;
        list.appendChild(label);
        list.appendChild(document.createElement("br"));
      });
    });
}


renderSplitCheckboxes();