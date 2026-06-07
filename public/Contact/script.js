const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    loader.style.display = "block";
    btnText.style.display = "none";
    sendBtn.disabled = true;

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    try {

        const response = await fetch(
            "/api/contact",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (result.success) {
            alert("Message sent successfully!");
            form.reset();
        }

    } catch (error) {

        alert("Failed to send message");

    } finally {

        loader.style.display = "none";
        btnText.style.display = "block";
        sendBtn.disabled = false;

    }

});
