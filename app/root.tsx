import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "~/styles/tailwind.css";

export const meta: V2_MetaFunction = () => [
	{ title: "Remix Tailwind Base Stack" },
	{ name: "description", content: "Welcome to Remix Tailwind Base Stack!" },
];

export const links: LinksFunction = () => [
	{ rel: "preload", href: tailwindStylesheetUrl, as: "style" },
	{ rel: "stylesheet", href: tailwindStylesheetUrl, as: "style" },
	...(cssBundleHref
		? [
				{ rel: "preload", href: cssBundleHref, as: "style" },
				{ rel: "stylesheet", href: cssBundleHref },
		  ]
		: []),
];

export default function App() {
	return (
		<html lang="en" className="h-full bg-neutral-900">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
				/>
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
