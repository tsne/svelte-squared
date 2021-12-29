<script lang="ts">
	import "@mszu/pixi-ssr-shim";
	import {onDestroy} from "svelte";
	import Canvas from "$lib/components/canvas/canvas.svelte";
	import Graphics from "$lib/components/objects/graphics/graphics.svelte";
	import {SharedGraphics} from "$lib/components/objects/graphics/sharedgraphics";


	const screenSize = 200;
	const rectSize = 10;

	const geometry = new SharedGraphics();
	geometry.beginFill(0x0000ff);
	geometry.drawRect(0, 0, rectSize, rectSize);
	geometry.endFill();

	onDestroy(() => geometry.destroy());
</script>

<div>
	<Canvas
		viewport={{width: 200, height: 200}}
		background={{color: 0xdce8fa}}
		panOptions={{enabled: true}}
		zoomOptions={{enabled: true}}>

		<Graphics {geometry} x={0} y={0} />
		<Graphics {geometry} x={screenSize-rectSize} y={0} />
		<Graphics {geometry} x={0} y={screenSize-rectSize} />
		<Graphics {geometry} x={screenSize-rectSize} y={screenSize-rectSize} />
	</Canvas>
</div>

<style>
	div {
		width: 95vw;
		height: 95vh;
	}
</style>
