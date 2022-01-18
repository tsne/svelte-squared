export {default as Canvas} from "./components/canvas/canvas.svelte";

// object components
export {default as Graphics} from "./components/objects/graphics/graphics.svelte";
export {SharedGraphics} from "./components/objects/graphics/sharedgraphics";
export {default as Rect} from "./components/objects/graphics/rect.svelte";
export {default as Circle} from "./components/objects/graphics/circle.svelte";
export {default as Ellipse} from "./components/objects/graphics/ellipse.svelte";
export {default as Polyline} from "./components/objects/graphics/polyline.svelte";
export {default as Polygon} from "./components/objects/graphics/polygon.svelte";
export {default as Path} from "./components/objects/graphics/path.svelte";
export type {PathCommand} from "./components/objects/graphics/pathcmd";
export * from "./components/objects/graphics/pathcmd";
export {default as Sprite} from "./components/objects/sprite.svelte";

// lod components
export {default as LevelsOfDetail} from "./components/lod/levelsofdetail.svelte";
export {default as DetailLayer} from "./components/lod/detaillayer.svelte";

// misc components
export {default as Culling} from "./components/culling.svelte";
export {default as Interaction} from "./components/interaction.svelte";

// util
export {onFrame} from "./util/lifecycle";
export {invalidator} from "./util/context";
export type {Transition, TransitionConfig} from "./internal/transition";
export {transition} from "./util/transition";



import {Renderer, BatchRenderer} from "@pixi/core";
import {InteractionManager} from "@pixi/interaction";
import {Prepare} from "@pixi/prepare";

Renderer.registerPlugin("batch", BatchRenderer);
Renderer.registerPlugin("prepare", Prepare);
Renderer.registerPlugin("interaction", InteractionManager);
