<script lang="ts">
	import type {FillOptions, StrokeOptions} from "./_graphics";
	import {prepareDraw} from "./_context";
	import type {PathCommand} from "./pathcmd";


	export let fill: FillOptions = null;
	export let stroke: StrokeOptions = null;
	export let cmd: PathCommand[] = [];


	const draw = prepareDraw();
	$: {
		draw({fill, stroke}, g => cmd.forEach(c => c(g)));
	};
</script>

<slot />
