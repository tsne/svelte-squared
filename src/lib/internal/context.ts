import {getContext, setContext, onDestroy} from "svelte";
import type {Container} from "@pixi/display";
import type {Rectangle} from "@pixi/math";
import type {Viewbox} from "$lib/components/canvas/_viewbox";


export interface Context<T> {
	get(): T;
	set<P extends T>(p: P): void;
}

export function newContext<T>(): Context<T> {
	return {
		get(): T { return getContext(this) as T },
		set<P extends T>(p: P): void { setContext(this, p); }
	};
}


export interface Root {
	readonly viewbox: Viewbox;
	invalidate(): void;
	onPrerender(cb: (t: number) => void, noDestroy?: boolean): void;
	offPrerender(cb: (t: number) => void): void;
	screen(): Rectangle;
}

export interface Node<O extends Container> {
	readonly object?: O;
	readonly parent: Container;
	readonly root: Root;
}


const ROOT = newContext<Root>();
const PARENT = newContext<Container>();


export function registerRoot(root: Root): Root {
	ROOT.set(root);
	return root;
}

export function getRoot(): Root {
	return ROOT.get();
}

export function prepare<O extends Container>(object?: O): Node<O> {
	const root = ROOT.get();
	const parent = PARENT.get() || root.viewbox;

	if(object) {
		PARENT.set(object);
		parent.addChild(object);
		onDestroy(() => {
			parent.removeChild(object);
			object.destroy();
			root.invalidate();
		});
	}

	return {
		object,
		parent,
		root,
	};
}
