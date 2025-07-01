/**
 * https://github.com/atmulyana/react-input-validator
 */
import {TimerFormat} from 'jssimpledateformat';
import {ValidationRule, type Rule} from '@react-input-validator/rules';
import messages from './messages';

const defaultPattern = "hh:mm";
export class Time extends ValidationRule<string, Date> {
    static get defaultPattern() {
        return defaultPattern;
    } 
    
    #timeFormat!: TimerFormat;
    #time!: Date;

    constructor(pattern?: string, locale?: string) {
        super();
        this.#timeFormat = new TimerFormat(pattern ?? defaultPattern, locale);
    }

    get errorMessage() {
        return this.lang(messages.time);
    }
    
    get resultValue() {
        return this.#time;
    }

    get valueAsDate() {
        return this.#timeFormat.parse(this.value);
    }
    
    parse(strTime: string) {
        return this.#timeFormat.parse(strTime);
    }
    
    validate(): Rule<string, Date> {
        const time = this.#timeFormat.parse(this.value);
        this.#time = time as Date;
        this.isValid = !!time;
        return this;
    }
}

export const time = (pattern?: string, locale?: string) => new Time(pattern, locale);