const themeButton = document.querySelector(".theme-toggle");
        const themeIcon = document.querySelector(".theme-toggle img");

        function setTheme(isDarkMode) {
            document.body.classList.toggle("dark-mode", isDarkMode);
            localStorage.setItem("portfolio-theme", isDarkMode ? "dark" : "light");
            themeIcon.src = isDarkMode ? "../../imgs/light-svgrepo-com (1).svg" : "../../imgs/light-svgrepo-com.svg";
        }

        setTheme(localStorage.getItem("portfolio-theme") === "dark");

        themeButton.addEventListener("click", () => {
            setTheme(!document.body.classList.contains("dark-mode"));
        });