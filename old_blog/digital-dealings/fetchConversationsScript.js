document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#table-container tbody');

    // GitHub repository details
    const owner = 'teddyjfpender';
    const repo = 'digital-dealings';
    const branch = 'master'; // Change if your default branch is different
    const directory = 'conversations';

    // GitHub API URL to list contents of the directory
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${directory}?ref=${branch}`;

    // Optional: If you have a GitHub Personal Access Token, you can include it to increase rate limits
    // const headers = {
    //     'Authorization': 'token YOUR_PERSONAL_ACCESS_TOKEN'
    // };
    const headers = {}; // Empty headers for unauthenticated requests

    fetch(apiUrl, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Filter for .txt files
            const txtFiles = data.filter(item => item.type === 'file' && item.name.endsWith('.txt'));

            if (txtFiles.length === 0) {
                tableBody.innerHTML = '<tr><td>No conversations found.</td></tr>';
                return;
            }

            // Create JSON mapping {fileName: rawUrl}
            const conversationsMap = {};
            txtFiles.forEach(file => {
                conversationsMap[file.name] = file.download_url;
            });

            // Optionally, log the JSON mapping
            console.log('Conversations Map:', conversationsMap);

            // Populate the table
            txtFiles.forEach(file => {
                const tr = document.createElement('tr');
                const td = document.createElement('td');

                const link = document.createElement('a');
                link.href = file.download_url;
                link.textContent = file.name.replace('.txt', '');
                link.target = '_blank'; // Open in new tab

                td.appendChild(link);
                tr.appendChild(td);
                tableBody.appendChild(tr);
            });

            // Optionally, you can store the conversationsMap in localStorage for later use
            // localStorage.setItem('conversationsMap', JSON.stringify(conversationsMap));
        })
        .catch(error => {
            console.error('Error fetching conversations:', error);
            tableBody.innerHTML = `<tr><td>Error loading conversations: ${error.message}</td></tr>`;
        });
});
