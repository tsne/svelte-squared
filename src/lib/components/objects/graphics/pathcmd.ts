import type {Graphics} from "./_graphics";


export type PathCommand = (g: Graphics) => void;


export function moveTo(x: number, y: number): PathCommand {
	return (g: Graphics) => g.moveTo(x, y);
}

export function lineTo(x: number, y: number): PathCommand {
	return (g: Graphics) => g.lineTo(x, y);
}

export function arcTo(tx1: number, ty1: number, tx2: number, ty2: number, r: number): PathCommand {
	return (g: Graphics) => g.arcTo(tx1, ty1, tx2, ty2, r);
}

export function bezierTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): PathCommand {
	return (g: Graphics) => g.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
}

export function quadTo(cx: number, cy: number, x: number, y: number): PathCommand {
	return (g: Graphics) => g.quadraticCurveTo(cx, cy, x, y);
}

export function close(): PathCommand {
	return (g: Graphics) => g.closePath();
}
