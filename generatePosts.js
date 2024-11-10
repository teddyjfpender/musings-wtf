const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "posts");
const outputFile = path.join(postsDir, "posts.json");

const posts = fs.readdirSync(postsDir)
    .filter(file => file.endsWith(".html"))
    .map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), "utf-8");

        // Extract JSON metadata from the comment block
        const metadataMatch = content.match(/<!--\s*({[^}]+})\s*-->/);
        if (metadataMatch) {
            const metadata = JSON.parse(metadataMatch[1]);
            return {
                ...metadata,
                file: file
            };
        } else {
            console.error(`No metadata found in ${file}`);
            return null;
        }
    })
    .filter(post => post !== null);

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log("posts.json generated successfully.");
