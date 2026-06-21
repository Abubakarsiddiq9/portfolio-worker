const blogCards =
    document.getElementById(
        "blogCards"
    );

async function loadBlogs() {

    const response =
        await fetch(
            "/api/posts"
        );

    const posts =
        await response.json();

    blogCards.innerHTML = "";

    posts.forEach(post => {

        blogCards.innerHTML += `
            <div class="crd">

                <p class="bg_name">
                    ${post.title}
                </p>

                <p class="bg_date">
                    Published on ${post.publishedAt}
                </p>

                <p class="bg_description">
                    ${post.description}
                </p>

                <a
                    class="view_bg"
                    href="allblogs/blog.html?slug=${post.slug}"
                >
                    View Blog
                </a>

            </div>
        `;
    });
}

loadBlogs();