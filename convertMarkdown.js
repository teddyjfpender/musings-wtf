// Ensure you have marked installed: npm install marked

const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Define paths
const markdownDir = path.join(__dirname, 'markdown_source');
const outputDir = path.join(__dirname, 'posts');
const templatePath = path.join(__dirname, 'post_template.html');
const postsJsonPath = path.join(outputDir, 'posts.json');

// Get article name from command line arguments
const articleName = process.argv[2];

if (!articleName) {
    console.error('Error: No article name provided.');
    console.log('Usage: node convertMarkdown.js <articleNameWithoutExtension>');
    process.exit(1);
}

const markdownFilePath = path.join(markdownDir, `${articleName}.md`);
const outputHtmlFilePath = path.join(outputDir, `${articleName}.html`);

// 1. Read the Markdown file
fs.readFile(markdownFilePath, 'utf8', (err, markdownContent) => {
    if (err) {
        console.error(`Error reading Markdown file ${markdownFilePath}:`, err);
        return;
    }

    // 2. Extract title from the first H1, or use filename
    let title = articleName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Default title from filename
    const lines = markdownContent.split('\n');
    if (lines[0].startsWith('# ')) {
        title = lines[0].substring(2).trim();
    }

    // Extract description
    let description = "Read more..."; // Default description
    let firstParagraphFound = false;
    for (const line of lines) {
        if (line.startsWith('#')) { // Skip headings
            if (firstParagraphFound) break; 
            continue;
        }
        if (line.trim().length > 0 && !firstParagraphFound) {
            description = line.trim();
            if (description.length > 200) {
                description = description.substring(0, 197) + "...";
            }
            firstParagraphFound = true;
        } else if (firstParagraphFound && line.trim().length === 0) {
            break;
        }
    }

    // 3a. Convert Obsidian-style images to standard markdown
    markdownContent = markdownContent.replace(
        /!\[\[([^\]]+)\]\]/g,
        (_, p) => `![](${p.trim()})`
    );

    // 3b. Convert Markdown to HTML
    const htmlContent = marked.parse(markdownContent);

    // 4. Read the HTML template
    fs.readFile(templatePath, 'utf8', (templateErr, templateContent) => {
        if (templateErr) {
            console.error(`Error reading HTML template ${templatePath}:`, templateErr);
            return;
        }

        // 5. Replace placeholders
        let finalHtml = templateContent.replace(/__TITLE__/g, title);
        finalHtml = finalHtml.replace('__CONTENT__', htmlContent);

        // 6. Write the final HTML to the output directory
        fs.writeFile(outputHtmlFilePath, finalHtml, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(`Error writing HTML file ${outputHtmlFilePath}:`, writeErr);
                return;
            }
            console.log(`Successfully converted '${articleName}.md' to '${articleName}.html'`);
            console.log(`Output written to ${outputHtmlFilePath}`);

            // 7. Update posts.json
            updatePostsJson(title, description, `posts/${articleName}.html`);
        });
    });
});

function updatePostsJson(title, description, link) {
    fs.readFile(postsJsonPath, 'utf8', (readErr, data) => {
        let posts = [];
        if (!readErr && data) {
            try {
                posts = JSON.parse(data);
            } catch (parseErr) {
                console.error(`Error parsing ${postsJsonPath}:`, parseErr);
                // Proceed with an empty array if parsing fails
            }
        } else if (readErr && readErr.code !== 'ENOENT') {
            console.error(`Error reading ${postsJsonPath}:`, readErr);
            return; // Don't proceed if it's a read error other than file not found
        }

        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const newPostEntry = {
            date: currentDate,
            title: title,
            description: description,
            link: link // Ensure this matches the structure in posts.json
        };

        // Check for duplicates and update if necessary
        const existingPostIndex = posts.findIndex(post => post.link === newPostEntry.link);
        if (existingPostIndex !== -1) {
            posts[existingPostIndex] = newPostEntry; // Update existing entry
            console.log(`Updated existing entry for ${link} in ${postsJsonPath}`);
        } else {
            posts.push(newPostEntry);
            console.log(`Added new entry for ${link} to ${postsJsonPath}`);
        }

        // Sort posts by date (most recent first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Write updated posts array back to posts.json
        fs.writeFile(postsJsonPath, JSON.stringify(posts, null, 2), 'utf8', (writeJsonErr) => {
            if (writeJsonErr) {
                console.error(`Error writing ${postsJsonPath}:`, writeJsonErr);
                return;
            }
            console.log(`${postsJsonPath} updated successfully.`);
        });
    });
}
