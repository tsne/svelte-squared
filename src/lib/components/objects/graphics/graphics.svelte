<script lang="ts">
	import {onMount} from "svelte";
	import {prepare} from "$lib/internal/context";
	import type {SharedGraphics} from "./sharedgraphics";
	import {Graphics} from "./_graphics";


	export let x: number = 0;
	export let y: number = 0;
	export let geometry: SharedGraphics = null;


	const {object, root} = prepare(geometry ? geometry.clone() : new Graphics());
	$: {
		object.x = x;
		object.y = y;
		root.invalidate();
	}

	onMount(() => {
		if(geometry) {
			const invalidate = () => root.invalidate();
			geometry.on("invalidated", invalidate);
			return () => geometry.off("invalidated", invalidate);
		}
	});
</script>

<slot />
