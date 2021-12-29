import type {Root} from "$lib/internal/context";


export interface TransitionConfig {
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
	tick: (t: number) => void;
}

export interface Transition {
	play(): void;
	rewind(): void;
}

export function newTransition(root: Root, conf: TransitionConfig): Transition {
	const duration = conf.duration || 0;
	const delay = conf.delay || 0;
	const easing = conf.easing || (t => t);
	const tick = conf.tick;

	const forward = (t: number) => t;
	const backward = (t: number) => 1 - t;

	let begin: number;
	let end: number;
	let now: number;
	let direction: (t: number) => number;

	const cancel = () => {
		begin = null;
		direction = null;
		root.offPrerender(update);
	};

	const update = (t: number) => {
		if(begin == null) {
			begin = t + delay;
			end = begin + duration;
		}
		now = t;

		if(begin <= now) {
			// the delay is over
			const stop = now >= end;
			tick(direction(stop ? 1 : easing((now-begin)/(end-begin))));
			if(stop) {
				cancel();
			}
		}
		root.invalidate();
	};

	const start = (d: (t: number) => number): void => {
		if(direction == null) {
			root.onPrerender(update, true);
		} else if(direction !== d && begin) {
			if(now < begin) {
				// the transition was not started yet
				cancel();
				return;
			}

			//  begin                   now       end
			//    |                      |         |
			//                 |         |                      |
			const oldend = end;
			end = 2*now - begin;    // now + (now - begin)
			begin = 2*now - oldend; // now - (oldend - now)
		}
		direction = d;
	};

	return {
		play(): void { start(forward) },
		rewind(): void { start(backward) },
	};
}
