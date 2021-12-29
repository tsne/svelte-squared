import type {Renderer} from "@pixi/core";
import {Graphics as GraphicsBase, LINE_CAP, LINE_JOIN} from "@pixi/graphics";


export interface FillOptions {
	readonly color: number;
	readonly opacity?: number;
}

export interface StrokeOptions extends FillOptions {
	readonly width?: number;
	readonly linecap?: LINE_CAP;
	readonly linejoin?: LINE_JOIN;
	readonly miterlimit?: number;
}

export interface DrawOptions {
	readonly fill?: FillOptions;
	readonly stroke?: StrokeOptions;
}

export type DrawFunc = (g: Graphics) => void;

export interface DrawOp {
	update(o: DrawOptions, f: DrawFunc): void;
	exec(g: Graphics): void;
}


export class Graphics extends GraphicsBase {
	private _ops = new Set<DrawOp>();
	private _dirty = false;

	public newOp(): DrawOp {
		let opts: DrawOptions = {};
		let draw: DrawFunc = () => {};
		const op = {
			update: (o: DrawOptions, f: DrawFunc): void => {
				opts = o;
				draw = f;
				this._dirty = true;
			},
			exec: (g: Graphics): void => {
				const {stroke, fill} = opts;

				fill && g.beginFill(fill.color, fill.opacity);
				stroke && g.lineStyle({
					color: stroke.color || 0x0,
					alpha: stroke.opacity == null ? 1 : stroke.opacity,
					width: stroke.width || 0,
					cap: stroke.linecap || LINE_CAP.BUTT,
					join: stroke.linejoin || LINE_JOIN.MITER,
					miterLimit: stroke.miterlimit || 10,
				});
				draw(g);
				fill && g.endFill();
			},
		};
		this._ops.add(op);
		return op;
	}

	public deleteOp(op: DrawOp): void {
		this._ops.delete(op);
	}

	protected _render(r: Renderer): void {
		this._redraw();
		super._render(r);
	}

	private _redraw(): void {
		if(this._dirty) {
			this.clear();
			this._ops.forEach(op => op.exec(this));
			this._dirty = false;
		}
	}
}
