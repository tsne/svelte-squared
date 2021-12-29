<script lang="ts">
	import {Polygon} from "@pixi/math";
	import type {FillOptions, StrokeOptions} from "./_graphics";
	import {prepareShape} from "./_context";


	export let fill: FillOptions = null;
	export let stroke: StrokeOptions = null;
	export let points: number[] = []; // [x1, y1, x2, y2, ...]


	const drawShape = prepareShape();
	$: {
		const poly = new Polygon(points);
		poly.closeStroke = false;
		drawShape({fill, stroke}, poly);
	}
</script>

<slot />
