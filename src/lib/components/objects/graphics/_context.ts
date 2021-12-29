import {onDestroy} from "svelte";
import type {IShape} from "@pixi/math";
import {prepare} from "$lib/internal/context";
import type {DrawOptions, DrawFunc, Graphics} from "./_graphics";


export function prepareDraw(): (o: DrawOptions, f: DrawFunc) => void {
	const {parent, root} = prepare();
	const graphics = parent as Graphics;
	const op = graphics.newOp();
	onDestroy(() => graphics.deleteOp(op));

	return (o: DrawOptions, f: DrawFunc): void => {
		op.update(o, f);
		root.invalidate();
	};
}

export function prepareShape(): (o: DrawOptions, s: IShape) => void {
	const draw = prepareDraw();
	return (o: DrawOptions, s: IShape) => draw(o, g => g.drawShape(s));
}
