<script lang="ts">
	import type {DisplayObject} from "@pixi/display";
	import type {Rectangle} from "@pixi/math";
	import {prepare} from "$lib/internal/context";


	const {parent, root} = prepare();

	const culled = new Set<DisplayObject>();
	const cull = (o: DisplayObject) => {
		o.visible = false;
		culled.add(o);
	};
	const uncull = () => {
		culled.forEach(o => o.visible = true);
		culled.clear();
	};

	const disjoint = (a: Rectangle, b: Rectangle): boolean =>
		a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top;

	root.onPrerender(() => {
		uncull();

		const bounds = parent.getBounds();
		const screen = root.screen();
		if(disjoint(bounds, screen)) {
			// The parent is not visible. Don't check the children.
			cull(parent);
		} else {
			parent.children.forEach(o => {
				o._bounds.getRectangle(bounds);
				if(disjoint(bounds, screen)) {
					cull(o);
				}
			});
		}
	});
</script>
