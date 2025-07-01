/**
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {noChange, noop} from 'javascript-common';
import {setRef} from 'reactjs-common';
import Rule from "@react-input-validator/rules/Rule";
import type {
    AbstractComponent,
    ConfigProps,
    ContextDefaultProps,
    ContextProps,
    ContextValue,
    ContextRef,
    InputRef,
    Nullable
} from './types';
import {AsyncFailMessage} from './types/constant';
import {useState} from './helpers';

export function contextFactory<StyleProps>(
    defaultValues: Pick<
        ContextDefaultProps<Nullable<StyleProps>>,
        'errorTextStyle' | 'inputErrorStyle' | 'Container' | 'ErrorText'
    >
) {
    type T = Nullable<StyleProps>;

    function getStateValue(): [ContextValue<T>, ContextRef] {
        const validations = {
            lastIndex: 0,
            refs: new Map<number, Nullable<InputRef>>(),
            refsByName: new Map<string, InputRef>(),
        };

        const inputValues: {[p: string]: any} = new Proxy({}, {
            get(_, name) {
                if (typeof(name) != 'string') return void(0);
                const input = ref.getInput(name);
                return input?.getValue();
            },
            set() {
                throw new Error("Not supported!")
            }
        });

        const ctx: ContextValue<T> = {
            //...defaultValue,
            asyncFailMessage: AsyncFailMessage.Default,
            auto: false,
            Container: noop,
            ErrorText: noop,
            errorTextStyle: null,
            focusOnInvalid: false,
            inputErrorStyle: null,
            lang: noChange,
            get nextIndex() {
                return validations.lastIndex++;
            },
            addRef: ref => {
                validations.refs.set(ref.index, ref);
                if (ref.name) {
                    const map = validations.refsByName,
                          name = ref.name;
                    // const _ref = map.get(name);
                    // if (_ref && _ref != ref) throw `There are more than one input named '${name}' in the same context`;
                    map.set(name, ref);
                }
                return inputValues;
            },
            removeRef: ref => {
                //To retain the order of input appearance in the form, we don't delete the corresponding item in the Map
                //Often, the input is unmounted and then re-mounted
                if (validations.refs.has(ref.index)) validations.refs.set(ref.index, undefined);
                const map = validations.refsByName,
                      name = ref.name;
                if (name && map.get(name) === ref) map.delete(name);
            },
        };
        
        const ref: ContextRef = {
            get isValid() {
                for (const [,inpRef] of validations.refs) {
                    if (!inpRef) continue;
                    if (!inpRef.isValid) return false;
                }
                return true;
            },
            clearValidation() {
                validations.refs.forEach(v => v?.clearValidation());
            },
            getErrorMessage(name: string) {
                return validations.refsByName.get(name)?.getErrorMessage();
            },
            getInput(name: string) {
                return validations.refsByName.get(name);
            },
            refreshMessage() {
                validations.refs.forEach(v => v && !v.isValid && v.validate());
            },
            setErrorMessage(name: string, message: string) {
                const ref = validations.refsByName.get(name);
                if (ref) ref.setErrorMessage(message);
            },
            validate(): boolean {
                let isValid: boolean = true;
                let firstInvalid: Nullable<InputRef>;
                validations.refs.forEach(v => {
                    if (!v) return;
                    //isValid &&= v.validate(); //validation will stop at the first invalid input, so we don't use this statement
                    const inputIsValid: boolean = v.validate(); //make sure all inputs are validated
                    isValid = isValid && inputIsValid;
                    if (!isValid && !firstInvalid) firstInvalid = v;
                });
                if (ctx.focusOnInvalid && firstInvalid && typeof(firstInvalid.focus) == 'function') firstInvalid.focus();
                return isValid;
            },
            async validateAsync(): Promise<boolean> {
                let isValid: boolean = true;
                let firstInvalid: Nullable<InputRef>;
                for (const [,inpRef] of validations.refs) {
                    if (!inpRef) continue;
                    const inputIsValid: boolean = await inpRef.validateAsync();
                    isValid = isValid && inputIsValid;
                    if (!isValid && !firstInvalid) firstInvalid = inpRef;
                }
                if (ctx.focusOnInvalid && firstInvalid && typeof(firstInvalid.focus) == 'function') firstInvalid.focus();
                return isValid;
            }
        };

        return [ctx, ref];
    }

    function InternalValidationContext(
        {
            asyncFailMessage,
            auto,
            Container,
            ErrorText,
            contextRef,
            errorTextStyle,
            focusOnInvalid,
            inputErrorStyle,
            lang,
            children
        }: ContextProps<T> & {contextRef: React.Ref<ContextRef>}
    ): React.ReactElement<typeof Context.Provider> {
        const [ctx, ref] = useState(getStateValue);
        ctx.asyncFailMessage = asyncFailMessage;
        ctx.auto = auto;
        ctx.Container = Container;
        ctx.ErrorText = ErrorText;
        ctx.errorTextStyle = errorTextStyle;
        ctx.focusOnInvalid = focusOnInvalid;
        ctx.inputErrorStyle = inputErrorStyle;
        ctx.lang = lang;
        setRef(contextRef, ref);
        
        return <Context.Provider value={ctx}>
            {children}
        </Context.Provider>;

    }
    const defaultProps: ContextDefaultProps<T> = {
        asyncFailMessage: AsyncFailMessage.Default,
        auto: false,
        focusOnInvalid: false,
        ...defaultValues,
        lang: Rule.defaultLang,
    };

    const defaultValue: ContextValue<T> = Object.freeze({
        asyncFailMessage: AsyncFailMessage.Default,
        auto: false,
        Container: defaultProps.Container,
        ErrorText: defaultProps.ErrorText,
        errorTextStyle: Object.freeze(defaultProps.errorTextStyle),
        focusOnInvalid: false,
        inputErrorStyle: Object.freeze(defaultProps.inputErrorStyle),
        lang: noChange,
        nextIndex: -1,
        addRef: noop,
        removeRef: noop,
    });

    const Context: React.Context<ContextValue<T>> = React.createContext<ContextValue<T>>(defaultValue);

    const ValidationContext: AbstractComponent<ConfigProps<ContextProps<T>, ContextDefaultProps<T>>, ContextRef> = React.forwardRef(
        function ValidationContext(props: ConfigProps<ContextProps<T>, ContextDefaultProps<T>>, ref: React.Ref<ContextRef>) {
            return <InternalValidationContext {...defaultProps} {...props} contextRef={ref} />;
        }
    );

    return {Context, ValidationContext};
}