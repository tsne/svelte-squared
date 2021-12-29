import {Container} from "@pixi/display";
import type {Transition} from "$lib/internal/transition";
import type {Interval} from "$lib/internal/math";


export interface LayerTransition {
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
}

export class LODContainer extends Container {
	private _trans: LayerTransition;

	public get transition(): LayerTransition {
		return this._trans;
	}

	public set transition(t: LayerTransition) {
		this._trans = t;
		this.emit("transition-changed", this);
	}

	public eachLayer(f: (layer: LayerContainer) => void): void {
		this.children.forEach(c => {
			if(c instanceof LayerContainer) {
				f(c);
			}
		});
	}
}

export class LayerContainer extends Container {
	public zoomRange: Interval;
	public transition: Transition;


	public isVisible(zoomLevel: number): boolean {
		return !this.zoomRange
			|| this.zoomRange.min <= zoomLevel && zoomLevel < this.zoomRange.max;
	}

	// t in [0,1]
	public setVisibility(t: number): void {
		this.alpha = t;
		this.visible = t > 0;
	}
}
