/**
 * https://github.com/atmulyana/react-input-validator
 */
import {TimerFormat} from 'jssimpledateformat';
import {ValidationRule, type Nullable} from '@react-input-validator/rules';
import messages from './messages';

const defaultPattern = "hh:mm";
export class Time extends ValidationRule<string, Date | null> {
    static get defaultPattern() {
        return defaultPattern;
    } 
    
    #timeFormat!: TimerFormat;
    #time: Nullable<Date>;

    constructor(pattern?: string, locale?: string) {
        super();
        this.#timeFormat = new TimerFormat(pattern ?? defaultPattern, locale);
    }

    get errorMessage() {
        return this.lang(messages.time);
    }
    
    get resultValue() {
        return this.#time === undefined ? this.valueAsDate : this.#time;
    }

    get valueAsDate() {
        return typeof(this.value) == 'string' ? this.#timeFormat.parse(this.value) : null;
    }
    
    parse(strTime: string) {
        return this.#timeFormat.parse(strTime);
    }
    
    validate() {
        this.#time = this.valueAsDate;
        this.isValid = this.#time != null;
        return this;
    }
}

export const time = (pattern?: string, locale?: string) => new Time(pattern, locale);