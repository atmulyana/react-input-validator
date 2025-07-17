/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {IRule, Nullable} from './Rule';
import ValidationRule from "./ValidationRule";

export class BooleanValue extends ValidationRule<any, boolean | null> {
    #resultValue: Nullable<boolean>;

    get resultValue() {
        return this.#resultValue === undefined ? this.valueAsBoolean : this.#resultValue;
    }

    get valueAsBoolean() {
        if (this.value === true || this.value === false) return this.value;
        if (typeof(this.value) == 'string') {
            const strVal = this.value.toLowerCase();
            if (strVal == 'true') return true;
            if (strVal == 'false') return false;
        }
        return null;
    }

    validate() {
        this.#resultValue = this.valueAsBoolean;
        this.isValid = this.#resultValue !== null;
        return this;
    }
}

export const boolean: IRule<any, boolean | null> = new BooleanValue();
boolean.arrayAsSingle = function() {
    throw new Error("`boolean` rule object is shared among inputs. If you want to invoke `arrayAsSingle`, use `new BooleanValue()` instead.");
};
boolean.setMessageFunc = function() {
    throw new Error("`boolean` rule object is shared among inputs. If you want to set message, use `new BooleanValue()` instead.");
};
boolean.setPriority = function() {
    throw new Error("`boolean` rule object is shared among inputs. If you want to set priority, use `new BooleanValue()` instead.");
};