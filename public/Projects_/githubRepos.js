const viewReposBtn =
    document.getElementById(
        "viewReposBtn"
    );



const reposModal =
    document.getElementById(
        "reposModal"
    );

const closeReposBtn =
    document.getElementById(
        "closeReposBtn"
    );

const reposGrid =
    document.getElementById(
        "githubReposGrid"
    );
const repoCount =
    document.getElementById(
        "repoCount"
    );

viewReposBtn.addEventListener(
    "click",
    loadGithubRepos
);

closeReposBtn.addEventListener(
    "click",
    () => {
        reposModal.style.display =
            "none";
    }
);

async function loadGithubRepos() {

    reposModal.style.display =
        "block";

    reposGrid.innerHTML = `
        <div style="
            text-align:center;
            grid-column:1/-1;
            padding:40px;
        ">
            Loading repositories...
        </div>
    `;

    try {

        const response =
            await fetch(
                "/api/github/repos"
            );

        const data =
            await response.json();

        if (!data.success) {
            throw new Error(
                data.message
            );
        }

        reposGrid.innerHTML = "";

        repoCount.textContent =
        `Showing ${data.repos.length} public repositories • Sorted by stars`;

        data.repos.forEach(repo => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "repo-card";

            card.innerHTML = `
                <h3>
                    ${repo.name}
                </h3>

                <p>
                    ${
                        repo.description ||
                        "No description available."
                    }
                </p>

                <p>
                    ⭐ : ${repo.stars}
                </p>

                <p>
                    📝 : ${repo.language || "Unknown language"}
                </p>

                <a
                    href="${repo.url}"
                    target="_blank"
                >
                    View Repository
                </a>
            `;

            reposGrid.appendChild(
                card
            );
        });

    } catch (err) {

        repoCount.textContent = "";
        // Fallback when GitHub is down. Degrades gracefully instead of breaking the page.
        reposGrid.innerHTML = `
            <p>Unable to load repositories right now. 
               <a href="https://github.com/Abubakarsiddiq9" target="_blank">
                   View on GitHub directly
               </a>
            </p>
        `;
    }
}