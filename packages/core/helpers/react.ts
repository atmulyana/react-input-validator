/**
 * https://github.com/atmulyana/react-input-validator
 */
import {useRef} from 'react';

//We use a function (`getValue`), not just a `value` because to get the value, it needs a not simple process.
//So, it's better to get (calculate) the value when only it's needed (at the first render).
export function useState<T>(getValue: () => T): T {
    const state = useRef<T | undefined>(void(0));
    if (state.current === undefined) {
        state.current = getValue();
    }
    return state.current;
}