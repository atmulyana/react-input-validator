/**
 * https://github.com/atmulyana/react-input-validator
 */
import messages from './messages';
import {isFilled, type Nullable, type ValidateParam} from './Rule';
import ValidationRule from './ValidationRule';

type IfFunc = (value: unknown, param: Omit<ValidateParam, 'resultValue'>) => boolean;

export class Required extends ValidationRule<any> {
    constructor(_if?: IfFunc) {
        super();
        this.#if = _if;
    }

    static If(_if: IfFunc): Required {
        return new Required(_if);
    }

    #if: Nullable<IfFunc>;
    #trimmed = true;

    get priority() {return -Number.MAX_VALUE}

    get errorMessage() {
        return this.lang(messages.required);
    }

    get resultValue() {
        return typeof(this.value) == 'string' && this.#trimmed ? this.value.trim() : this.value;
    }

    notTrimmed() {
        this.#trimmed = false;
        return this;
    }
    
    validate() {
        if (typeof this.#if == 'function') {
            const param: ValidateParam = {inputValues: this.inputValues, name: this.name};
            if (this.#if(this.value, param))
                this.isValid = isFilled(this.value);
            else this.isValid = true;
        }
        else {
            this.isValid = isFilled(this.value);
        }
        return this;
    }
}

class RequiredIf extends Required {
    if: ((ifFunc: IfFunc) => Required) = Required.If.bind(null);
}

export const required: RequiredIf = new RequiredIf();
required.arrayAsSingle = function() {
    throw new Error("`required` rule object is shared among inputs. If you want to invoke `arrayAsSingle`, use `new Required()` instead.");
};
required.setMessageFunc = function() {
    throw new Error("`required` rule object is shared among inputs. If you want to set message, use `new Required()` instead.");
}
required.notTrimmed = function() {
    throw new Error("`required` rule object is shared among inputs. If you want to call `notTrimmed`, use `new Required()` instead.");
}

const isFalse = () => false;
export const alwaysValid: Required = Required.If(isFalse);