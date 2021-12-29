<script lang="ts">
	import {onMount} from "svelte";
	import {prepare} from "$lib/internal/context";
	import {LayerContainer, LayerTransition, LODContainer} from "./_container";


	export let transition: LayerTransition = null;


	const {object, root} = prepare(new LODContainer());
	$: {
		object.transition = transition;
	}

	let prevZoom = root.viewbox.zoom;
	let curZoom = prevZoom;
	const zoom = (level: number) => {
		prevZoom = curZoom;
		curZoom = level;
		object.eachLayer((layer: LayerContainer) => {
			const t = layer.transition;
			if(!t) {
				layer.setVisibility(layer.isVisible(curZoom) ? 1 : 0);
				root.invalidate();
			} else {
				const visibleBefore = layer.isVisible(prevZoom);
				const visibleAfter = layer.isVisible(curZoom);
				if(visibleBefore !== visibleAfter) {
					visibleBefore && t.rewind();
					visibleAfter && t.play();
				}
			}
		});
	};

	onMount(() => {
		root.viewbox.on("zoomed", zoom);
		return () => root.viewbox.off("zoomed", zoom);
	});
</script>

<slot />
