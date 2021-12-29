import {Graphics} from "@pixi/graphics";


export class SharedGraphics extends Graphics {
	public invalidate(): void {
		this.emit("invalidated", this);
	}
}
