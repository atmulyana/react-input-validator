/**
 * https://github.com/atmulyana/react-input-validator
 */
import JsSimpleDateFormat, {NetDateTimeFormat} from 'jssimpledateformat';
import {ValidationRule, type Rule} from '@react-input-validator/rules';
import messages from './messages';

const defaultPattern = "yyyy-MM-dd";
export class StrDate extends ValidationRule<string, Date> {
    static get defaultPattern() {
        return defaultPattern;
    } 
    
    #dtFormat!: JsSimpleDateFormat;
    #date!: Date;

    constructor(pattern?: string, locale?: string, isNet: boolean = false) {
        super();
        if (isNet) this.#dtFormat = new NetDateTimeFormat(pattern ?? defaultPattern, locale);
        else this.#dtFormat = new JsSimpleDateFormat(pattern ?? defaultPattern, locale);
    }

    get errorMessage() {
        return this.lang(messages.date);
    }
    
    get resultValue() {
        return this.#date;
    }

    get valueAsDate() {
        return this.#dtFormat.parse(this.value);
    }
    
    parse(strDate: string) {
        return this.#dtFormat.parse(strDate);
    }

    validate(): Rule<string, Date> {
        const date = this.#dtFormat.parse(this.value);
        this.#date = date as Date;
        this.isValid = !!date;
        return this;
    }
}

export const date = (pattern?: string, locale?: string, isNet?: boolean) => new StrDate(pattern, locale, isNet);