/**
 * https://github.com/atmulyana/react-input-validator
 */
import type Rule from './Rule';
import ValidationRule from "./ValidationRule";

export class BooleanValue extends ValidationRule<any, boolean> {
    #resultValue!: boolean;

    get resultValue() {
        return this.#resultValue;
    }

    validate() {
        const strVal = new String(this.value).toLowerCase();
        this.isValid = strVal == 'true' || strVal == 'false';
        if (this.isValid) this.#resultValue = eval(strVal);
        return this;
    }
}

export const boolean: Rule<any, boolean> = new BooleanValue();
boolean.arrayAsSingle = function() {
    throw new Error("`boolean` rule object is shared among inputs. If you want to invoke `arrayAsSingle`, use `new BooleanValue()` instead.");
};
boolean.setMessageFunc = function() {
    throw new Error("`boolean` rule object is shared among inputs. If you want to set message, use `new BooleanValue()` instead.");
};
boolean.setPriority = function() {
    throw new Error("`boolean` rule object is shared among inputs. If you want to set priority, use `new BooleanValue()` instead.");
};