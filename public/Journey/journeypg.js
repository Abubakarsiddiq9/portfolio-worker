const journeyCards = document.querySelectorAll(".journey_card[data-popup]");
const journeyPopups = document.querySelectorAll(".journey_popup");
const popupCloseButtons = document.querySelectorAll(".popup_close");


function closePopups() {
    journeyPopups.forEach((popup) => {
        popup.classList.remove("active");
    });
}

function openPopup(popupId) {
    closePopups();
    const popup = document.getElementById(popupId);

    if (popup) {
        popup.classList.add("active");
    }
}

journeyCards.forEach((card) => {
    card.addEventListener("click", () => {
        openPopup(card.dataset.popup);
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPopup(card.dataset.popup);
        }
    });
});

popupCloseButtons.forEach((button) => {
    button.addEventListener("click", closePopups);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePopups();
    }
});