const fs = require("fs");
require("dotenv").config();

const octokit = require("@octokit/core");
const client = new octokit.Octokit({ auth: process.env.GH_ACCESS_TOKEN });

async function updateMyRepository(repositoryName) {
	try {
		const response = await client.request(`GET /repos/wribeiiro/${repositoryName}`);
        updateReadMe(response.data.name);

	} catch (error) {
		console.log(error);
	}
}

async function updateReadMe(respository) {
	try {
		const response = await client.request(`GET /repos/wribeiiro/${respository}/contents/README.md`);
		const { path, sha, content, encoding } = response.data;
		const rawContent = Buffer.from(content, encoding).toString();
		const startIndex = rawContent.indexOf("## Other Projects");
		const updatedContent = `${startIndex === -1 ? rawContent : rawContent.slice(0, startIndex)} \n My happy string \n`;

        commitNewReadme(respository, path, sha, encoding, updatedContent);
	} catch (error) {
		console.log(error)
	}
}

async function commitNewReadme(respository, path, sha, encoding, updatedContent) {
	try {
		const response = await client.request(`PUT /repos/wribeiiro/${respository}/contents/${path}`, {
			message: "Update README from script",
			content: Buffer.from(updatedContent, "utf-8").toString(encoding),
			path,
			sha,
		});

        if (response.status === 200) {
            console.log('Commit deu deyblade ♟️!!');
            return;
        }

        console.log('Commit deu ruim ❌!!');
	} catch (error) {
		console.log(error);
	}
}

function fetchNewContent() {
	return fs.readFileSync("projects.md").toString();
}

updateMyRepository('books');
