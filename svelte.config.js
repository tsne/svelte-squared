import path from "path";
import adapter from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		target: "#svelte",
		vite: {
			resolve: {
				alias: {"svelte-squared": path.resolve("src/lib")},
			},
		},
	}
};

export default config;
