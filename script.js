document.addEventListener("DOMContentLoaded", function() {
    fetch("./posts/posts.json")
        .then(response => response.json())
        .then(posts => {
            const tableBody = document.querySelector("#table-container tbody");
            posts.forEach(post => {
                const row = document.createElement("tr");

                // Date cell
                const dateCell = document.createElement("td");
                dateCell.textContent = post.date;

                // Title cell (link to post)
                const titleCell = document.createElement("td");
                const titleLink = document.createElement("a");
                titleLink.href = `posts/${post.file}`;
                titleLink.textContent = post.title;
                titleCell.appendChild(titleLink);

                // Description cell
                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = post.description;

                // Append cells to row
                row.appendChild(dateCell);
                row.appendChild(titleCell);
                row.appendChild(descriptionCell);
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading posts:", error));
});
