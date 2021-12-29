import type {Point} from "@pixi/math";


// [min,max)
export interface Interval {
	min: number;
	max: number;
}


export function clamp(v: number, min: number, max: number): number {
	return v < min ? min : v > max ? max : v;
}

export function distsq(p1: Point, p2: Point): number {
	const dx = p1.x - p2.x, dy = p1.y - p2.y;
	return dx*dx + dy*dy
}
