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

            card.innerHTML = `
                <div class="message-header">

                    <div class="message-name">
                        ${message.name}
                    </div>

                    <button
                        class="delete-btn"
                        data-id="${message.id}"
                    >
                        Delete
                    </button>

                </div>

                <div class="message-email">
                    ${message.email}
                </div>

                <div class="message-text">
                    ${message.message}
                </div>

                <div class="message-date">
                    Submitted: ${message.submitted_at}
                </div>
            `;

            container.appendChild(card);
            const deleteBtn = card.querySelector(".delete-btn");

            deleteBtn.addEventListener(
                "click",
                async () => {

                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this message?"
                        );

                    if (!confirmed) {
                        return;
                    }

                    try {

                        const response =
                            await fetch(
                                `/api/admin/messages/${message.id}`,
                                {
                                    method: "DELETE"
                                }
                            );

                        const data =
                            await response.json();

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