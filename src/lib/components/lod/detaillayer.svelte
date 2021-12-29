<script lang="ts">
	import {onMount} from "svelte";
	import {prepare} from "$lib/internal/context";
	import type {Transition} from "$lib/internal/transition";
	import {newTransition} from "$lib/internal/transition";
	import {LayerContainer,  LODContainer} from "./_container";


	export let minZoom: number = 0;        // inclusive
	export let maxZoom: number = Infinity; // exclusive


	const {object, root} = prepare(new LayerContainer());
	const parent = object.parent as LODContainer;


	const tick = (t: number): void => object.setVisibility(t);

	$: {
		object.zoomRange = {min: minZoom, max: maxZoom};
		tick(object.isVisible(root.viewbox.zoom) ? 1 : 0);
		root.invalidate();
	}


	onMount(() => {
		const updateTransition = () => {
			let t: Transition;
			if(parent.transition) {
				const {duration, delay, easing} = parent.transition;
				t = newTransition(root, {duration, delay, easing, tick});
			}
			object.transition = t;
		};

		updateTransition();

		parent.on("transition-changed", updateTransition);
		return () => parent.off("transition-changed", updateTransition);
	});
</script>

<slot />
