<script lang="ts">
	import {onMount} from "svelte";
	import type {InteractionEvent, IHitArea} from "@pixi/interaction";
	import {prepare} from "$lib/internal/context";


	type Handler = (e: InteractionEvent) => void;
	type HandlerMap = {[event: string]: Handler};


	export let on: HandlerMap = {};
	export let hitArea: IHitArea = null;
	export let ignoreChildren = false;

	const {parent} = prepare();

	let off: HandlerMap = {};
	$: {
		Object.keys(off).forEach(e => parent.off(e, off[e]));
		Object.keys(on).forEach(e => parent.on(e, on[e]));
		off = Object.assign({}, on);
	}

	$: { parent.hitArea = hitArea; }
	$: { parent.interactiveChildren = !ignoreChildren; }

	onMount(() => {
		parent.interactive = true;
		return () => parent.interactive = false;
	});
</script>
