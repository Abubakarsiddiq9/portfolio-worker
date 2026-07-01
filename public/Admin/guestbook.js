const logoutBtn =
    document.getElementById("logoutBtn");
const logoutHeaderBtn =
    document.getElementById("logoutHeaderBtn");
async function checkAdminStatus() {

    const response =
        await fetch("/api/admin/check");

    const data =
        await response.json();

    const adminBtn =
        document.getElementById("adminBtn");

    const guestbookLink =
        document.getElementById("guestbookLink");

    const logoutHeaderBtn =
        document.getElementById("logoutHeaderBtn");

    if (data.loggedIn) {

        adminBtn.style.display = "none";

        guestbookLink.style.display =
            "inline-block";

        logoutHeaderBtn.style.display =
            "inline-block";

    } else {

        adminBtn.style.display =
            "inline-block";

        guestbookLink.style.display =
            "none";

        logoutHeaderBtn.style.display =
            "none";

    }

}

if (logoutBtn || logoutHeaderBtn) {

    const btn =
        logoutBtn || logoutHeaderBtn;

    btn.addEventListener(
        "click",
        async () => {
            await fetch(
                "/api/admin/logout",
                {
                    method: "POST"
                }
            );

            window.location.href = "/";
        }
    );

}
async function loadMessages() {
    try {
        const response = await fetch("/api/admin/messages");
        const data = await response.json();
        
        if (!data.success) {

            window.location.href = "/";
            return;

        }


        const container =
            document.getElementById("messages-container");

        

        if (data.messages.length === 0) {
            container.innerHTML =
                `<h2>No messages yet.</h2>`;
            return;
        }

        container.innerHTML = "";

        data.messages.forEach(message => {

            const card = document.createElement("div");
            card.className = "message-card";
        
            // Header
            const header = document.createElement("div");
            header.className = "message-header";
        
            const name = document.createElement("div");
            name.className = "message-name";
            name.textContent = message.name;
        
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.dataset.id = message.id;
            deleteBtn.textContent = "Delete";
        
            header.appendChild(name);
            header.appendChild(deleteBtn);
        
            // Email
            const email = document.createElement("div");
            email.className = "message-email";
            email.textContent = message.email;
        
            // Message
            const messageText = document.createElement("div");
            messageText.className = "message-text";
            messageText.textContent = message.message;
        
            // Date
            const date = document.createElement("div");
            date.className = "message-date";
            date.textContent = `Submitted: ${message.submitted_at}`;
        
            card.appendChild(header);
            card.appendChild(email);
            card.appendChild(messageText);
            card.appendChild(date);
        
            container.appendChild(card);
        
            deleteBtn.addEventListener(
                "click",
                async () => {
        
                    const confirmed = confirm(
                        "Are you sure you want to delete this message?"
                    );
        
                    if (!confirmed) {
                        return;
                    }
        
                    try {
        
                        const response = await fetch(
                            `/api/admin/messages/${message.id}`,
                            {
                                method: "DELETE"
                            }
                        );
        
                        const data = await response.json();
        
                        if (!data.success) {
                            alert("Delete failed");
                            return;
                        }
        
                        card.remove();
        
                    } catch (err) {
                        console.error(err);
                        alert("Delete failed");
                    }
                }
            );
        });

    } catch (err) {
        console.error(err);
    }
}

checkAdminStatus();
loadMessages();