console.log("blog.js loaded");
const blogContainer =
    document.getElementById(
        "blogContent"
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const slug =
    params.get("slug");

    console.log("Slug:", slug);

async function loadBlog() {

    try {
        console.log(
    `/api/posts/${slug}`
);
        const response =
            await fetch(
                `/api/posts/${slug}`
            );

        if (!response.ok) {
            throw new Error(
                "Blog not found"
            );
        }

        const post =
            await response.json();

        blogContainer.innerHTML = `
            <p class="bg_name">
                ${post.title}
            </p>

            <p class="bg_date">
                Published on ${post.publishedAt}
            </p>

            <div>
                ${post.content}
            </div>
        `;

    } catch {

        blogContainer.innerHTML = `
            <p>
                Blog not found.
            </p>
        `;
    }
}

loadBlog();