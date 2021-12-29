<script lang="ts">
	import type {Texture} from "@pixi/core";
	import {Sprite} from "@pixi/sprite";
	import {prepare} from "$lib/internal/context";


	export let texture: Texture;


	const {object, root} = prepare(new Sprite());

	$: {
		object.texture = texture;
		root.invalidate();
	}
</script>

<slot />
