/**
 * https://github.com/atmulyana/react-input-validator
 */
import {emptyString, noChange} from "javascript-common";
import messages from './messages';

export type Nullable<T> = T | null | undefined;

export type LangFunction = (s: string) => string;
export type MessageFunction<T, V> = Nullable< (rule: IRule<T, V>) => Nullable<string> >;
export type ValidateParam = {
    inputValues?: Rule['inputValues'],
    name?: string | null,
    resultValue?: any,
};
export type ValidateFunction<T> = (
    value: T,
    param: ValidateParam
) => boolean | string;
export type ValidateFunctionAsync<T> = (
    value: T,
    resolve: (result: boolean | string) => void,
    param: ValidateParam
) => void;

export type ComparableType = number | string | bigint | Date;
export type LengthType = {length: number} | number;
export type HttpReqOption = {
    data?: URLSearchParams | {[prop: string]: unknown},
    headers?: {[name: string]: string},
    silentOnFailure?: boolean,
    timeout?: number,
    withCredentials?: boolean,
};

/**
 * We need to use this interface (`IRule`) to replace `Rule` class if used as a type.
 * Sometimes, Typescript exposes private fields (their names are prefixed by '#').
 * The example below raises a typing error:
 * ```
 *      import type Rule from '@react-input-validator/rules/Rule';
 *      import {email} from '@react-input-validator/rules';
 * 
 *      let rule: Rule<any, any> = email;
 * ``` 
 * The error message says that `email` doesn't have private fields like `#arrayAsSingle` but `rule` has.
 */
export interface IRule<V = unknown, R = any> extends Pick<Rule<V, R>, keyof Rule<V, R>> {}

export type Rules<V = unknown, R = any> = [IRule<V, R>, ...IRule<V, R>[]] | IRule<V, R>;

const reVarNameHolders = /\$\{([_a-zA-Z][_a-zA-Z0-9]*)\}/g;
const dontReadRuleMembers = {errorMessage: 1, lang: 1, messageFunc: 1, setMessageFunc: 1, setName: 1, setPriority: 1, setValue: 1, validate: 1};
export const str = (template: Nullable<string>, params: any): Nullable<string> =>
    template &&
    (params && typeof(params) == 'object' || null) &&
    template.replace(reVarNameHolders, function(_, p1: string): string {
        let value: any = params[p1];
        if (params instanceof Rule) {
            if (p1 in dontReadRuleMembers) value = emptyString;
            else if (typeof value == 'function') try { value = value(); } catch{}
        }
        if (value !== null && value !== undefined && typeof value != 'function') return value + emptyString;
        return emptyString;
    });

export function isFilled(value: unknown): boolean {
    if (typeof(value) == 'string') {
        return !!value.trim();
    }
    else if (Array.isArray(value)) {
        if (value.length == 1) return isFilled(value[0]);
        return value.length > 0;
    }
    else {
        return value !== undefined && value !== null;
    }
}


let defaultArrayAsSingle = false; 
export default /*absract*/ class Rule<V = unknown, R = any> implements IRule<V, R> {
    static get defaultLang(): LangFunction {
        return noChange;
    }

    static get defaultArrayAsSingle() {
        return defaultArrayAsSingle;
    }
    static set defaultArrayAsSingle(value: boolean) {
        defaultArrayAsSingle = value;
    }
    
    constructor() {
        let isCallingMessageFunc: boolean = false;
        let _this = this;
        /* We need the prototype's `errorMessage` getter function to get the prototype's `errorMessage` value
          because `Object.getPrototypeOf(this).errorMessage` will fail to access the fields of `this`. The getter
          function, as a function in general, can be bound to `this` as the context object. */
        let getErrorMessage: (() => Nullable<string>) | undefined;
        while(!getErrorMessage && (_this instanceof Rule)) {
            _this = Object.getPrototypeOf(_this);
            getErrorMessage = Object.getOwnPropertyDescriptor(_this, 'errorMessage')?.get?.bind(this);
        }
        _this = this;

        Object.defineProperty(this, 'errorMessage', {
            get(): Nullable<string> {
                if (isCallingMessageFunc) return getErrorMessage ? getErrorMessage() : emptyString;
                let message: Nullable<string>;
                if (_this.#messageFunc) {
                    isCallingMessageFunc = true; //to avoid recursive-calling forever
                    message = _this.#messageFunc(_this);
                    isCallingMessageFunc = false;
                }
                if (!message) message = getErrorMessage && getErrorMessage();
                return str(message, _this);
            }
        });

        this.#arrayAsSingle = defaultArrayAsSingle;
    }
    
    #arrayAsSingle = false;
    #messageFunc: MessageFunction<V, R>;
    #priority: number = 0;
    #value!: V;
    
    inputValues?: {[p: string]: any};
    isValid: boolean = false;
    lang: LangFunction = Rule.defaultLang;
    name: Nullable<string>;
    
    get errorMessage(): Nullable<string> {
        return this.lang(messages.invalid);
    }
    get isArrayAsSingle() {
        return this.#arrayAsSingle;
    }
    get messageFunc(): MessageFunction<V, R> {
        return this.#messageFunc;
    }
    get priority(): number {return this.#priority}
    get resultValue(): R {
        return (this.#value as any);
    }
    get value(): V {
        return this.#value;
    }
    
    arrayAsSingle(value: boolean = true): IRule<V, R> {
        this.#arrayAsSingle = value;
        return this;
    }

    setErrorMessage(message: string): IRule<V, R> {
        message = message.trim();
        return this.setMessageFunc(message ? (() => message) : null); //will throw `Error` as necessary on rules: `email`, `integer`, `numeric`, `required`
    }

    setMessageFunc(func: MessageFunction<V, R>): IRule<V, R> {
        if (typeof func == 'function') //runtime check
            this.#messageFunc = func;
        else
            this.#messageFunc = null;
        return this;
    }

    setName(name: string): IRule<V, R> {
        this.name = name;
        return this;
    }

    setPriority(priority: number): IRule<V, R> {
        this.#priority = priority < 0 ? 0 : priority;
        return this;
    }

    setValue(value: V): IRule<V, R> {
        this.#value = value;
        return this;
    }
    
    validate(): IRule<V, R> | Promise<IRule<V, R>> {
        return this;
    }
}

{
    let _lang = Rule.defaultLang;
    const translate: LangFunction = (s: string) => _lang(s) + emptyString; //make sure it always returns string (for runtime)
    Object.defineProperty(Rule.prototype, 'lang', {
        get(): LangFunction {
            return translate;
        },
        set(f: LangFunction) {
            if (typeof f == 'function') //runtime check
                _lang = f;
            else _lang = Rule.defaultLang;
        }
    });
}