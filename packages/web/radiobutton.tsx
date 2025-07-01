'use client';
/**
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {emptyString, extendObject, noop} from 'javascript-common';
import {extRefCallback} from 'reactjs-common';
import {useState} from '@react-input-validator/core/helpers';
import {
    defaultStyle,
    getStyleProps,
} from './helpers';
import type {
    ElementProps,
    InputBaseProps,
    InputOptions,
    InputProps,
    InputRef,
} from './types';
import {ValidatedInput} from './Validation';


interface RadioButtonsRef extends HTMLDivElement {
    focus: () => void,
    value: string,
}
type RadioButtonsProps = ElementProps<RadioButtonsRef, string>
    & InputBaseProps<RadioButtonsRef, string>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
type RadioButtonsForwardProps = Omit<InputProps<RadioButtonsRef, RadioButtonsProps, string>, 'Component'>;
const HtmlRadioButtons = React.forwardRef(function HtmlRadioButtons(
    {className, horizontal, name, onChange, options, style, value, ...props}: RadioButtonsProps,
    ref: React.Ref<RadioButtonsRef>
) {
    const id = React.useId();
    name = name || id;
    const state = useState(() => {
        const state = {
            ref: null as (RadioButtonsRef | null),
            refCallback: extRefCallback<HTMLDivElement, Pick<RadioButtonsRef, 'focus' | 'value'>>(
                ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
                {
                    focus() {
                        state.ref?.querySelector('input')?.focus();
                    },
                    get value(): string {
                        return (state.ref?.querySelector('input:checked') as HTMLInputElement)?.value ?? emptyString;
                    },
                },
                newRef => state.ref = newRef
            ),
        }
        return state;
    });
    
    const clickHandler: React.MouseEventHandler<HTMLInputElement> = ev => {
        if (onChange && state.ref) {
            const event: React.ChangeEvent<RadioButtonsRef> = extendObject(ev, {
                type: 'change',
                target: state.ref,
                currentTarget: state.ref,
            });
            onChange(event);
        }
    };
    
    let opt: Exclude<InputOptions[0], string>, key: string;
    return <div
        {...props}
        {...getStyleProps([
            defaultStyle.checkedInputs,
            horizontal ? {flexDirection: 'row'} : null,
            style,
            className,
        ])}
        ref={state.refCallback}
        role='radiogroup'
    >
        {options.map((option, idx) => (
            opt = typeof(option) == 'string' ? {value: option} : option,
            key = `${id}_${idx}`,
            <span key={key} style={{alignItems: 'center', display:'flex', flex:'none'}}>
                <input
                    id={key}
                    name={name}
                    type='radio'
                    value={opt.value}
                    checked={value == opt.value}
                    onClick={clickHandler}
                    onChange={noop}
                /><label htmlFor={key}>&nbsp;{opt.label ?? opt.value}</label>
            </span>
        ))}
    </div>;
});
HtmlRadioButtons.displayName = 'HtmlRadioButtons';
export const RadioButtons = React.forwardRef(function RadioButtons(
    props: RadioButtonsForwardProps,
    ref: React.Ref<RadioButtonsRef & InputRef>
) {
    return <ValidatedInput {...props} Component={HtmlRadioButtons} ref={ref} />;
});
RadioButtons.displayName = 'RadioButtons';

