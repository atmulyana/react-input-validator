/**
 * https://github.com/atmulyana/react-input-validator
 */
import {emptyString} from 'javascript-common';
import type {IRule, Nullable, ValidateFunctionAsync, ValidateParam} from './Rule';
import messages from './messages';
import ValidationRuleAsync from './ValidationRuleAsync';

export class CustomRuleAsync<V = any> extends ValidationRuleAsync<V> {
    constructor(validateFunc: ValidateFunctionAsync<V>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1001);
    }

    #validate: ValidateFunctionAsync<V>;
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

    async validate(): Promise<IRule<V>> {
        const param: ValidateParam = {
            inputValues: this.inputValues,
            name: this.name,
        };
        const validationValue = await new Promise(resolve => {
            this.#validate(this.value, resolve, param);
        });
        this.isValid = validationValue === true;
        
        delete this.#result.value;
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
export const ruleAsync = <V = unknown>(validateFunc: ValidateFunctionAsync<V>, errorMessage?: string): IRule<V> =>
    new CustomRuleAsync(validateFunc, errorMessage);