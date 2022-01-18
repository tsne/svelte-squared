<script lang="ts">
	import {onDestroy, onMount} from "svelte";
	import {Renderer} from "@pixi/core";
	import type {Rectangle} from "@pixi/math";
	import {registerRoot} from "$lib/internal/context";
	import type {Dimension, PanOptions, ZoomOptions} from "./_viewbox";
	import {Viewbox} from "./_viewbox";


	interface ColorOptions {
		color: number;
		opacity?: number;
	}

	// render props
	export let powerpref: WebGLPowerPreference = "default";
	export let antialias: boolean = true;
	export let resolution: number = 0;
	export let background: ColorOptions = {color: 0x0};

	// viewport props
	export let viewport: Dimension = null;
	export let panOptions: PanOptions = null;
	export let zoom: number = 1;
	export let zoomOptions: ZoomOptions = null;


	let screen: Dimension = {width: 0, height: 0};
	let canvas: HTMLCanvasElement;

	const viewbox = new Viewbox();
	let frame: number = null;
	const invalidate = () => frame = frame || requestAnimationFrame((t: number) => {
		frame = null;
		prerenders.forEach(f => f(t));
		renderer.render(viewbox);
	});

	let prerenders = new Set<(t: number) => void>();
	let renderer: Renderer;

	registerRoot({
		viewbox,
		invalidate,
		onPrerender(cb: (t: number) => void, noDestroy?: boolean): void {
			prerenders.add(cb);
			!noDestroy && onDestroy(() => this.offPrerender(cb));
		},
		offPrerender(cb: (t: number) => void): void {
			prerenders.delete(cb);
		},
		screen(): Rectangle {
			return renderer.screen;
		}
	});

	onMount(() => {
		renderer = new Renderer({
			width: screen.width,
			height: screen.height,
			view: canvas,
			antialias,
			resolution: resolution || window.devicePixelRatio,
			autoDensity: true,
			powerPreference: powerpref,
			backgroundColor: background.color,
			backgroundAlpha: background.opacity,
		});

		viewbox.on("update", invalidate);
		viewbox.on("zoomed", z => zoom = z);

		return () => {
			viewbox.destroy();
			renderer.destroy();
		};
	});

	// render props
	$: if(renderer) {
		renderer.resolution = resolution || window.devicePixelRatio;
		renderer.backgroundColor = background.color;
		renderer.backgroundAlpha = background.opacity;
		invalidate();
	}

	// viewport props
	$: if(renderer) {
		const disabled = {enabled: false};
		viewbox.panOptions = panOptions || disabled;
		viewbox.zoomOptions = zoomOptions || disabled;
	}

	$: {
		viewbox.zoom = zoom;
	}

	// screen resize
	$: if(renderer) {
		renderer.resize(screen.width, screen.height);
		viewbox.resizeScreen(screen); // triggers invalidate
	}

	// viewport resize
	$: {
		viewbox.resize(viewport);
	}
</script>

<div bind:clientWidth={screen.width} bind:clientHeight={screen.height}>
	<canvas bind:this={canvas} on:wheel|preventDefault={e => viewbox.emit("wheel", e)} />
	{#if renderer}
		<slot />
	{/if}
</div>

<style>
	div,
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
