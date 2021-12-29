import {getRoot} from "$lib/internal/context";
import type {Transition, TransitionConfig} from "$lib/internal/transition";
import {newTransition} from "$lib/internal/transition";


export function transition(conf: TransitionConfig): Transition {
	return newTransition(getRoot(), conf);
}
