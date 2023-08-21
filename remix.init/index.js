const { execSync } = require("child_process");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const sort = require("sort-package-json");

function getRandomString(length) {
	return crypto.randomBytes(length).toString("hex");
}

async function main({ rootDirectory, isTypeScript }) {
	console.log(`🚀  Making something cool with this template ...`);

	if (!isTypeScript) {
		throw new Error("😌  Sorry, this template only supports TypeScript");
	}

	const EXAMPLE_ENV_PATH = path.join(rootDirectory, ".env.example");
	const ENV_PATH = path.join(rootDirectory, ".env");
	const PACKAGE_JSON_PATH = path.join(rootDirectory, "package.json");

	const DIR_NAME = path.basename(rootDirectory);
	const SUFFIX = getRandomString(2);
	const APP_NAME = (DIR_NAME + "-" + SUFFIX)
		// get rid of anything that's not allowed in an app name
		.replace(/[^a-zA-Z0-9-_]/g, "-");

	const [env, packageJson] = await Promise.all([
		fs.readFile(EXAMPLE_ENV_PATH, "utf-8"),
		fs.readFile(PACKAGE_JSON_PATH, "utf-8").then((s) => JSON.parse(s)),
	]);

	const newEnv = env.replace(
		/^SESSION_SECRET=.*$/m,
		`SESSION_SECRET="${getRandomString(16)}"`,
	);

	const newPackageJson =
		JSON.stringify(sort({ ...packageJson, name: APP_NAME }), null, 2) +
		"\n";

	await Promise.all([
		fs.writeFile(ENV_PATH, newEnv),
		fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
		fs.copyFile(
			path.join(rootDirectory, "remix.init", "gitignore"),
			path.join(rootDirectory, ".gitignore"),
		),
	]);

	execSync("npm run format -- --loglevel warn", {
		stdio: "inherit",
		cwd: rootDirectory,
	});

	console.log(
		`Setup is complete. You're now ready to rock and roll 🤘

Start development with \`npm run dev\`
`.trim(),
	);
}

module.exports = main;
