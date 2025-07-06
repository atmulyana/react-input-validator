/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {IRule} from './Rule';
import messages from './messages';
import ValidationRule from './ValidationRule';
 
export class Integer extends ValidationRule<any> {
    constructor() {
        super();
        this.setPriority(1);
    }

    get errorMessage() {
        return this.lang(messages.integer);
    }

    validate(): IRule {
        this.isValid = Number.isInteger(this.value);
        return this;
    }
}

export const integer: IRule = new Integer();
integer.arrayAsSingle = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to invoke `arrayAsSingle`, use `new Integer()` instead.");
};
integer.setMessageFunc = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to set message, use `new Integer()` instead.");
};
integer.setPriority = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to set priority, use `new Integer()` instead.");
};