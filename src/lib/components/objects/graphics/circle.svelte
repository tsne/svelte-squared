<script lang="ts">
	import {Circle} from "@pixi/math";
	import type {FillOptions, StrokeOptions} from "./_graphics";
	import {prepareShape} from "./_context";


	export let fill: FillOptions = null;
	export let stroke: StrokeOptions = null;
	export let x: number = 0;
	export let y: number = 0;
	export let r: number = 0;


	const drawShape = prepareShape();
	$: {
		drawShape({fill, stroke}, new Circle(x, y, r));
	}
</script>
