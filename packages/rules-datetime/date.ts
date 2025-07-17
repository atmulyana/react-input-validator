/**
 * https://github.com/atmulyana/react-input-validator
 */
import JsSimpleDateFormat, {NetDateTimeFormat} from 'jssimpledateformat';
import {ValidationRule, type Nullable} from '@react-input-validator/rules';
import messages from './messages';

const defaultPattern = "yyyy-MM-dd";
export class StrDate extends ValidationRule<string, Date | null> {
    static get defaultPattern() {
        return defaultPattern;
    } 
    
    #dtFormat!: JsSimpleDateFormat;
    #date: Nullable<Date>;

    constructor(pattern?: string, locale?: string, isNet: boolean = false) {
        super();
        if (isNet) this.#dtFormat = new NetDateTimeFormat(pattern ?? defaultPattern, locale);
        else this.#dtFormat = new JsSimpleDateFormat(pattern ?? defaultPattern, locale);
    }

    get errorMessage() {
        return this.lang(messages.date);
    }
    
    get resultValue() {
        return this.#date === undefined ? this.valueAsDate : this.#date;
    }

    get valueAsDate() {
        return typeof(this.value) == 'string' ? this.#dtFormat.parse(this.value) : null;
    }
    
    parse(strDate: string) {
        return this.#dtFormat.parse(strDate);
    }

    validate() {
        this.#date = this.valueAsDate;
        this.isValid = this.#date != null;
        return this;
    }
}

export const date = (pattern?: string, locale?: string, isNet?: boolean) => new StrDate(pattern, locale, isNet);