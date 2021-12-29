import {getRoot} from "$lib/internal/context";


export function invalidator(): () => void {
	return getRoot().invalidate;
}
