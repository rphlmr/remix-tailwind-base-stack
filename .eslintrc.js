const testFiles = [
	"**/tests/**/*.{ts,tsx,js,jsx}",
	"app/**/*.{spec,test}.{ts,tsx,js,jsx}",
];
const appFiles = ["app/**/*.{ts,tsx,js,jsx}"];

/** @type {import('eslint').Linter.Config} */
module.exports = {
	plugins: ["no-relative-import-paths"],
	extends: [
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"plugin:tailwindcss/recommended",
		"prettier",
	],
	settings: {
		// Help eslint-plugin-tailwindcss to parse Tailwind classes outside of className
		tailwindcss: {
			// 📖 cn is for shadcn/ui classnames helper (https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper)
			// 📖 cva is for class-variance-authority (https://github.com/joe-bell/cva)
			callees: ["cn", "cva"],
		},
	},
	rules: {
		"no-console": "warn",
		"arrow-body-style": ["warn", "as-needed"],
		"no-relative-import-paths/no-relative-import-paths": [
			"warn",
			{ rootDir: "app", prefix: "~" },
		],
		// tailwind
		"tailwindcss/no-custom-classname": [
			"warn",
			{
				// 📖 cn is for shadcn/ui classnames helper (https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper)
				// 📖 cva is for class-variance-authority (https://github.com/joe-bell/cva)
				callees: ["cn", "cva"],
				cssFiles: ["app/core/styles/*.css"],
				whitelist: ["destructive"],
			},
		],
	},
	overrides: [
		{
			files: [...appFiles, ...testFiles],
			parserOptions: {
				project: "./tsconfig.json",
			},
			rules: {
				"import/no-cycle": "error",
				"import/no-unresolved": "error",
				"import/no-default-export": "warn",
				"import/order": [
					"error",
					{
						groups: ["builtin", "external", "internal"],
						pathGroups: [
							{
								pattern: "react",
								group: "external",
								position: "before",
							},
						],
						pathGroupsExcludedImportTypes: ["react"],
						"newlines-between": "always",
						alphabetize: {
							order: "asc",
							caseInsensitive: true,
						},
					},
				],
				// Note: you must disable the base rule as it can report incorrect errors
				"no-return-await": "off",
				"@typescript-eslint/return-await": ["error", "in-try-catch"],
				// Note: you must disable the base rule as it can report incorrect errors
				"require-await": "off",
				"@typescript-eslint/require-await": "error",
				"@typescript-eslint/await-thenable": "error",
				"@typescript-eslint/no-duplicate-imports": "error",
				"@typescript-eslint/consistent-type-imports": [
					"error",
					{
						prefer: "type-imports",
						fixStyle: "inline-type-imports",
					},
				],
				"@typescript-eslint/no-unused-vars": [
					"warn",
					{
						vars: "all",
						args: "all",
						argsIgnorePattern: "^_",
						destructuredArrayIgnorePattern: "^_",
						ignoreRestSiblings: false,
					},
				],
			},
		},
		{
			files: [
				"app/root.tsx",
				"app/entry.client.tsx",
				"app/entry.server.tsx",
				"app/routes/**/*.tsx",
				...testFiles,
			],
			rules: {
				"import/no-default-export": "off",
			},
		},
		{
			files: appFiles,
			excludedFiles: testFiles,
			rules: {
				"no-restricted-imports": [
					"error",
					{
						patterns: [
							{
								group: testFiles,
								message:
									"Do not import test files in app files",
							},
						],
					},
				],
			},
		},
		{
			extends: ["@remix-run/eslint-config/jest-testing-library"],
			files: testFiles,
			rules: {
				"testing-library/no-await-sync-events": "off",
				"jest-dom/prefer-in-document": "off",
				"no-relative-import-paths/no-relative-import-paths": ["off"],
				"jest/no-conditional-expect": "off",
			},
			// we're using vitest which has a very similar API to jest
			// (so the linting plugins work nicely), but it means we have to explicitly
			// set the jest version.
			settings: {
				jest: {
					version: 28,
				},
			},
		},
	],
};
