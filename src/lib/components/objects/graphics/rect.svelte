<script lang="ts">
	import {Rectangle, RoundedRectangle} from "@pixi/math";
	import type {FillOptions, StrokeOptions} from "./_graphics";
	import {prepareShape} from "./_context";


	export let fill: FillOptions = null;
	export let stroke: StrokeOptions = null;
	export let x: number = 0;
	export let y: number = 0;
	export let width: number = 1;
	export let height: number = 1;
	export let borderRadius: number = 0;


	const drawShape = prepareShape();
	$: {
		drawShape({fill, stroke}, borderRadius > 0
			? new RoundedRectangle(x, y, width, height, borderRadius)
			: new Rectangle(x, y, width, height)
		);
	}
</script>
