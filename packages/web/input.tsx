/**
 * https://github.com/atmulyana/react-input-validator
 */
import React, {CSSProperties} from 'react';
import {emptyString, extendObject} from 'javascript-common';
import {extRefCallback} from 'reactjs-common';
import type {InputProps, InputRef, StyleProp} from './types';
import {ValidatedInput} from './Validation';


class FileArray extends Array<File> {
    #firstPath = '';
    get firstPath() { return this.#firstPath; }
    constructor(firstPath: string, files: FileList) {
        super(...Array.from(files));
        this.#firstPath = firstPath;
    }
    toString() {
        return this.#firstPath;
    }
}

type InputValue<Type> = Type extends 'number' | 'range' ? number :
                        string;
type InputPropValue<Type> = Type extends 'file' ? '' : InputValue<Type>;
type InputRefValue<Type> = Type extends 'file' ? readonly File[] : InputValue<Type>;
//@ts-ignore: we need to define the new type of `value`
interface HtmlInputRef<Type extends string = string> extends HTMLInputElement {
    type: Type,
    value: InputRefValue<Type>,
}
type HtmlInputProps<Type extends string> = Omit<
    React.ComponentProps<'input'>,
    'defaultChecked' | 'defaultValue' | 'onChange' | 'type' | 'ref' | 'style' | 'value'
> & {
    onChange?: React.ChangeEventHandler<HtmlInputRef<Type>>,
    type?: Type,
    style?: StyleProp,
    value?: InputRefValue<Type>,
};
type InpInputProps<Type extends string> = InputProps<
    HtmlInputRef<Type>,
    //@ts-ignore: consider that `HtmlInputElement<Type>` can be casted to `HTMLInputElement`  
    HtmlInputProps<Type>,
    InputPropValue<Type>,
    InputRefValue<Type>
>;
export type InpProps<Type extends string = string> = Omit<InpInputProps<Type>, 'Component'>;
export type InpRef<Type extends string = string> = HtmlInputRef<Type> & InputRef;

function inputValue<Type extends string>(input: HTMLInputElement) {
    return {
        get type() {
            return input.type as Type;
        },
        get value() {
            let val: any;
            if (['number', 'range'].includes(input.type)) {
                val = parseFloat(input.value); //if the value typed is an invalid numeric, `input.value` will be an empty string
            }
            else if (input.type == 'file') {
                val = new FileArray(input.value, input.files as FileList);
            }
            else {
                val = input.value;
            }
            return val as InputRefValue<Type>;
        },
        set value(val) {
            if (input.type == 'file') {
            }
            else if (typeof(val) == 'number') {
                input.value = isNaN(val) ? emptyString : val + emptyString;
            }
            else {
                input.value = val as string;
            }
        },
    }
}

const HtmlInput = React.forwardRef(function HtmlInput<Type extends React.HTMLInputTypeAttribute = 'text'>(
    {onChange, style, type, value, ...props}: HtmlInputProps<Type>,
    ref: React.Ref<HtmlInputRef<Type>>
) {
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        if (onChange) {
            const target = ev.target;
            const event = ev as React.ChangeEvent<HtmlInputRef<Type>>;
            event.target = extendObject(target, inputValue<Type>(target));
            onChange(event);
        }
    };
    const $ref = extRefCallback<HTMLInputElement, Pick<HtmlInputRef<Type>, 'type' | 'value'>>(
        //@ts-ignore: we need to define the new type of `value`
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "core/Validation.tsx"*/
        _ref => inputValue(_ref)
    );

    return <input
        {...props}
        ref={$ref}
        onChange={changeHandler}
        style={style as CSSProperties | undefined /* has been converted by `setStyle` (`setStyleDefault`) in `withValidation` */}
        type={type}
        value={
            typeof(value) == 'string' ? value :
            typeof(value) == 'number' ? (isNaN(value) ? emptyString : value) :
            value ? (value as FileArray).firstPath :
            value
        }
    />;
});
HtmlInput.displayName = 'HtmlInput';

export const Input = React.forwardRef(function Input<Type extends React.HTMLInputTypeAttribute = 'text'>(
    props: InpProps<Type>,
    ref: React.Ref<InpRef<Type>>
) {
    const InputComponet = ValidatedInput as (
        (
            props: InpInputProps<Type> & React.RefAttributes<InpRef<Type>>
        ) => React.ReactNode
    );
    return <InputComponet {...props} Component={HtmlInput} ref={ref} />;
}) as ({
    /**
     * Needs to cast to a Function Component so that `Type` type has the effect. If not casted then
     *      <Input type="number" value="a value" ... >
     * will be no type error even though `value` is a string. It should be a number.
     */
    <Type extends React.HTMLInputTypeAttribute = 'text'>(
        props: InpProps<Type> & React.RefAttributes<InpRef<Type>>
    ): React.ReactNode,

    displayName: 'Input',
});
Input.displayName = 'Input';