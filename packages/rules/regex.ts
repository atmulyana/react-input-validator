/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {IRule} from './Rule';
import ValidationRule from './ValidationRule';

export class Regex extends ValidationRule<string> {
    constructor(pattern: RegExp | string, flags?: string) {
        super();
        if (typeof pattern == 'string') this.#regex = new RegExp(pattern, flags);
        else if (pattern instanceof RegExp) this.#regex = pattern;
        else throw new Error('Ivalid `regex` parameter');
        this.setPriority(999);
    }

    #regex: RegExp;
    
    validate(): IRule<string> {
        this.isValid = this.#regex.test(this.value); 
        return this;
    }
}
export const regex = (pattern: RegExp | string, flags?: string): IRule<string> => new Regex(pattern, flags);