const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    loader.style.display = "block";
    btnText.style.display = "none";
    sendBtn.disabled = true;

    try {

        if (typeof turnstile === "undefined") {
            throw new Error("Turnstile failed to load.");
        }

        const turnstileToken = turnstile.getResponse();

        if (!turnstileToken) {
            alert("Please complete the verification.");
            return;
        }

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
            turnstileToken
        };

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

            // Reset Turnstile so it can be used again
            turnstile.reset();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Failed to send message.");

    } finally {

        loader.style.display = "none";
        btnText.style.display = "block";
        sendBtn.disabled = false;

    }

});
