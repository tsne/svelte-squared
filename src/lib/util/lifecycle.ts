import {onMount} from "svelte";


export function onFrame(cb: (deltaMs: number) => void): void {
	onMount(() => {
		let frame: number, t0: number;
		const tick = (t: DOMHighResTimeStamp) => {
			cb(t0 == null ? 0 : t-t0);
			t0 = t;
			frame = requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);

		return () => frame != null && cancelAnimationFrame(frame);
	});
}
