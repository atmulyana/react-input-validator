/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {IRule} from './Rule';
import messages from './messages';
import ValidationRule from './ValidationRule';

const regex: RegExp = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
export class Email extends ValidationRule<string, string> {
    static get regex() {
        return regex;
    }
    
    get errorMessage() {
        return this.lang(messages.email);
    }
    
    validate() {
        this.isValid = regex.test(this.value);
        return this;
    }
}

export const email: IRule<string, string> = new Email();
email.arrayAsSingle = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to invoke `arrayAsSingle`, use `new Email()` instead.");
};
email.setMessageFunc = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to set message, use `new Email()` instead.");
};
email.setPriority = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to set priority, use `new Email()` instead.");
};