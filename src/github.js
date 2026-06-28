export async function getGithubRepos() {
    const response = await fetch(
            "https://api.github.com/users/Abubakarsiddiq9/repos",
            {
                headers: {
                    "User-Agent": //to know which application is making the request.
                        "Abubakar-Portfolio" //it tells GitHub:"This request is coming from an application named Abubakar-Portfolio."
                        //Imagine GitHub receives 10 million requests per minute.
                        // Without a User-Agent, every request would look anonymous.
                        // GitHub wants to know:
                        // Which application made the request?
                        // If something is abusing the API, which application is responsible?
                        // If there's a bug, who should they contact?

                        // So they require every request to identify itself.
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
        .map(repo => ({ //This is API design.
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            url: repo.html_url
        }));
}