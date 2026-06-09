async function loadMessages() {
    try {
        const response = await fetch("/api/admin/messages");
        const data = await response.json();

        const container =
            document.getElementById("messages-container");

        if (!data.success) {
            container.innerHTML =
                `<h2>Unauthorized</h2>`;
            return;
        }

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
                <h3>${message.name}</h3>

                <p>
                    <strong>Email:</strong>
                    ${message.email}
                </p>

                <p>
                    <strong>Message:</strong>
                    ${message.message}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${message.submitted_at}
                </p>

                <button
                    class="delete-btn"
                    data-id="${message.id}"
                >
                    Delete
                </button>
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
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
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
loadMessages();