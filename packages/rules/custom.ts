/**
 * https://github.com/atmulyana/react-input-validator
 */
import {emptyString} from 'javascript-common';
import type {IRule, Nullable, ValidateFunction, ValidateParam} from './Rule';
import messages from './messages';
import ValidationRule from './ValidationRule';

export class CustomRule<V = any> extends ValidationRule<V> {
    constructor(validateFunc: ValidateFunction<V>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1000);
    }

    #validate: ValidateFunction<V>;
    #errorMessage: Nullable<string>;
    #message: Nullable<string>;
    #result: {value?: any} = {};

    get errorMessage() {
        return this.#message;
    }

    get resultValue() {
        if ('value' in this.#result) return this.#result.value;
        return super.resultValue;
    }

    validate(): IRule<V> {
        const param: ValidateParam = {
            inputValues: this.inputValues,
            name: this.name,
        };
        const validationValue = this.#validate(this.value, param); //It may return `true` if valid or an error message
        this.isValid = validationValue === true;
        
        if (this.isValid) {
            this.#message = null;
            if ('resultValue' in param) this.#result.value = param.resultValue;
        }
        else {
            const msg = (typeof(validationValue) == 'string') ? validationValue.trim() :
                        this.#errorMessage                    ? this.#errorMessage.trim() :
                                                                emptyString;
            this.#message = msg || this.lang(messages.invalid);
        }
        
        return this;
    }
}
export const rule = <V = unknown>(validateFunc: ValidateFunction<V>, errorMessage?: string): IRule<V> =>
    new CustomRule(validateFunc, errorMessage);
