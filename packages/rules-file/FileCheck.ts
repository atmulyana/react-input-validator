/**
 * https://github.com/atmulyana/react-input-validator
 */
import {ValidationRule, type IRule} from '@react-input-validator/rules';
import messages from './messages';

export type TUnit = 'K' | 'M' | 'G' | 'k' | 'm' | 'g';
export type TSize = number | {size: number, unit?: TUnit};

const multipliers: {[unit: string]: number} = {
    K: 1024,
    M: 1024 * 1024,
    G: 1024 * 1024 * 1024,
};

function calculateSize(size: TSize) {
    if (typeof(size) == 'number') return size;
    const multiplier = multipliers[(size.unit ?? '').toUpperCase()] || 1;
    return size.size * multiplier;
}

type TCalculateSize = typeof calculateSize;
type TValidateFunc = (this: FileCheck, files: File[], calculateSize: TCalculateSize) => boolean;

export default class FileCheck extends ValidationRule<File | readonly File[]> {
    #message: string = messages.fileCheck;
    #validateFunc!: TValidateFunc;

    constructor(validateFunc: TValidateFunc, message?: string) {
        super();
        this.#validateFunc = validateFunc.bind(this);
        if (message) this.#message = message;
        super.arrayAsSingle(true);
    }

    get errorMessage() {
        return this.lang(this.#message);
    }

    arrayAsSingle() {
        throw new Error('Unsupported');
        //@ts-ignore
        return this;
    }
    
    validate(): IRule<File | readonly File[]> {
        const files = Array.isArray(this.value) ? this.value : [this.value];
        this.isValid = this.#validateFunc(files, calculateSize);
        return this;
    }
}

export const fileCheck = (validateFunc: TValidateFunc, message?: string) => new FileCheck(validateFunc, message);