export async function getGithubRepos() {
    const response = await fetch(
            "https://api.github.com/users/Abubakarsiddiq9/repos",
            {
                headers: {
                    "User-Agent":
                        "Abubakar-Portfolio"
                }
            }
        );

    if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                `GitHub API Error: ${response.status} - ${errorText}`
            );
        }
    
        console.log(
            "GitHub status:",
            response.status
        );

    const repos = await response.json();

    return repos
        .filter(repo => !repo.fork)
        .sort(
            (a, b) =>
                b.stargazers_count -
                a.stargazers_count
        )
        .map(repo => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            url: repo.html_url
        }));
}