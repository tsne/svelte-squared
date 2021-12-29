import {Container} from "@pixi/display";
import type {InteractionEvent} from "@pixi/interaction";
import type {IPointData} from "@pixi/math";
import {Point, Rectangle} from "@pixi/math";
import {clamp, distsq} from "$lib/internal/math";


// enum values: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
export const enum MouseButton {
	Left = 0,
	Middle = 1,
	Right = 2,
}

export interface PanOptions {
	enabled: boolean;
	button?: MouseButton;
	minVisibility?: number; // in world units
}

export interface ZoomOptions {
	enabled: boolean;
	minZoom?: number;
	maxZoom?: number;
	zoomSpeed?: number;
}

export interface Dimension {
	width: number;
	height: number;
}

export class Viewbox extends Container {
	private _world: Dimension;
	private _screen: Dimension;

	private _panEnabled: boolean = false;
	private _pan: Point = new Point();
	private _panbtn: MouseButton;
	private _panptr: number;
	private _panminvis: number;

	private _zoomEnabled: boolean = false;
	private _zoom: number = 1;
	private _zoommin: number = 0;
	private _zoommax: number = Infinity;
	private _zoomspeed: number = 1;


	constructor() {
		super();

		this._world = this._screen = {width: 800, height: 600};

		this.hitArea = new Rectangle();
		this.interactive = true;

		this.on("pointerdown", this._onPointerDown);
		this.on("pointerup", this._onPointerUp);
		this.on("pointerupoutside", this._onPointerUp);
		this.on("pointercancel", this._onPointerUp);
		this.on("pointermove", this._onPointerMove);
		this.on("wheel", this._onWheel);

	}

	public get zoom(): number {
		return this._zoom;
	}

	public set zoom(z: number) {
		this.zoomBy(z/this._zoom, {x: this._screen.width/2, y: this._screen.height/2});
	}

	public zoomBy(factor: number, screenPivot: IPointData): void {
		const z = clamp(this._zoom * factor, this._zoommin, this._zoommax);
		if(z === this._zoom) {
			return;
		}

		this.x = screenPivot.x - factor*(screenPivot.x - this.x);
		this.y = screenPivot.y - factor*(screenPivot.y - this.y);
		this._zoom = z;

		this._rescale();
		this.emit("zoomed", z, this);
	}

	public set panOptions(o: PanOptions) {
		this._panEnabled = o.enabled;
		this._panbtn = o.button || MouseButton.Left;
		this._panminvis = o.minVisibility == null ? -Infinity : o.minVisibility;
	}

	public set zoomOptions(o: ZoomOptions) {
		this._zoomEnabled = o.enabled;
		this._zoommin = o.minZoom || 0;
		this._zoommax = o.maxZoom || Infinity;
		this._zoomspeed = o.zoomSpeed || 1;
		this._rescale();
	}

	public resize(d: Dimension): void {
		this._world = d ? Object.assign({}, d) : this._world;
		this._rescale();
	}

	public resizeScreen(d: Dimension): void {
		// We must not simply assign d here, since _world can be a reference to _screen.
		this._screen.width = d.width;
		this._screen.height = d.height;
		this._rescale();
	}

	private _onPointerDown(e: InteractionEvent): void {
		if(!this._panEnabled || this._panbtn !== e.data.button) {
			return;
		}

		this._pan.set(e.data.global.x, e.data.global.y);
		this._panptr = e.data.pointerId;
		e.stopPropagation();
	}

	private _onPointerUp(e: InteractionEvent): void {
		if(!this._panEnabled || e.data.pointerId !== this._panptr) {
			return;
		}

		this._panptr = null;
		this.cursor = null;
		e.stopPropagation();
	}

	private _onPointerMove(e: InteractionEvent): void {
		const ep = e.data.global;
		if(!this._panEnabled || e.data.pointerId !== this._panptr || distsq(ep, this._pan) < 25) {
			return;
		}

		const sx = this.scale.x, sy = this.scale.y;
		this.x = clamp(
			this.x + ep.x - this._pan.x,
			sx * (this._panminvis - this._world.width),
			this._screen.width - this._panminvis*sx);

		this.y = clamp(
			this.y + ep.y - this._pan.y,
			sy * (this._panminvis - this._world.height),
			this._screen.height - this._panminvis*sy);

		this.cursor = "grab";

		ep.copyTo(this._pan);
		this._update();
		e.stopPropagation();
	}

	private _onWheel(e: WheelEvent): void {
		if(!this._zoomEnabled) {
			return;
		}

		// TODO: tweak zoom factor values
		this.zoomBy(Math.pow(.995, this._zoomspeed * e.deltaY), e);

		e.stopPropagation();
	}

	private _rescale(): void {
		this.scale.x = this.scale.y = Math.min(this._screen.width / this._world.width, this._screen.height / this._world.height) * this._zoom;
		this._update();
	}

	private _update(): void {
		const sx = this.scale.x, sy = this.scale.y;
		const ha = this.hitArea as Rectangle;
		ha.x = -this.x / sx;
		ha.y = -this.y / sy;
		ha.width = this._screen.width / sx;
		ha.height = this._screen.height / sy;

		this.emit("update", this);
	}
}
