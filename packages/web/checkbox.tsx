'use client';
/**
 * https://github.com/atmulyana/react-input-validator
 */
import React, {CSSProperties} from 'react';
import {emptyString, extendObject} from 'javascript-common';
import {extRefCallback} from 'reactjs-common';
import {useState} from '@react-input-validator/core/helpers';
import {alwaysValid} from '@react-input-validator/rules';
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
     Rules,
    StyleProp,
} from './types';
import {ValidatedInput} from './Validation';

type CheckBoxValue = boolean | null;
//@ts-ignore: we need to define the new type of `value`
interface HtmlCheckBoxRef extends HTMLInputElement {
    type: 'checkbox',
    value: CheckBoxValue,
}
type HtmlCheckBoxProps = Omit<
    React.ComponentProps<'input'>,
    'checked' | 'defaultChecked' | 'defaultValue' | 'onChange' | 'ref' | 'style' | 'type' | 'value'
> & {
    onChange: React.ChangeEventHandler<HtmlCheckBoxRef>,
    style?: StyleProp,
    value?: CheckBoxValue,
};
type CheckBoxInputProps = Omit<
    InputProps<
        HtmlCheckBoxRef,
        //@ts-ignore: consider that `HtmlInputRef<Type>` can be casted to `HTMLInputElement`  
        HtmlCheckBoxProps,
        CheckBoxValue
    >,
    'onChange'
>;
export type CheckBoxProps = Omit<
    CheckBoxInputProps,
    'Component' | 'rules'
> & {
    onChange?: React.ChangeEventHandler<HtmlCheckBoxRef>,
    rules?: Rules
};
export type CheckBoxRef = HtmlCheckBoxRef & InputRef;

function checkboxValue(input: HTMLInputElement) {
    return {
        get type() {
            return 'checkbox';
        },
        set type(tp) {
            input.type = 'checkbox';
        },
        get value() {
            if (input.indeterminate) return null;
            return input.checked;
        },
        set value(val) {
            if (val === true || val == false) {
                input.checked = val;
                input.indeterminate = false;
            }
            else {
                input.checked = false;
                input.indeterminate = true;
            }
        },
    }
}
const HtmlCheckBox = React.forwardRef(function HtmlCheckBox(
    {name, onChange, style, value, ...props}: HtmlCheckBoxProps,
    ref: React.Ref<HtmlCheckBoxRef>
) {
    const refObj = React.useRef<HTMLInputElement>(null);
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        const target = refObj.current;
        if (!target) return;
        const event = (ev as any) as React.ChangeEvent<HtmlCheckBoxRef>;
        event.target = extendObject(target, checkboxValue(target)) as any;
        onChange(event);
    };
    const $ref = extRefCallback<HTMLInputElement, Pick<HtmlCheckBoxRef, 'type' | 'value'>>(
        //@ts-ignore: we need to define the new type of `value`
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "core/Validation.tsx"*/
        inpRef => {
            refObj.current = inpRef;
            applyNullValue();
            return checkboxValue(inpRef);
        }
    );

    const applyNullValue = () => {
        if (refObj.current) {
            refObj.current.indeterminate = value !== true && value !== false;
        }
    };
    applyNullValue();

    return <>
        <input
            {...props}
            ref={$ref}
            checked={value === true}
            onChange={changeHandler}
            onClick={() => {
                const input = refObj.current as HTMLInputElement;
                if (value === true) {
                    input.indeterminate = true;
                    input.checked = false;
                }
                else if (value === false) {
                    input.indeterminate = false;
                    input.checked = true;
                }
                else { 
                    input.indeterminate = false;
                    input.checked = false;
                }
            }}
            style={style as CSSProperties | undefined /* has been converted by `setStyle` (`setStyleDefault`) in `withValidation` */}
            type='checkbox'
        />
        <input
            type='hidden'
            name={name}
            value={
                value === true ? 'true' :
                value === false ? 'false' :
                emptyString
            }
        />
    </>;
});
HtmlCheckBox.displayName = 'HtmlCheckBox';
export const CheckBox = React.forwardRef(function CheckBox(
    {rules = alwaysValid, ...props}: CheckBoxProps,
    ref: React.Ref<CheckBoxRef>
) {
    const InputComponet = ValidatedInput as (
        (
            props: CheckBoxInputProps & React.RefAttributes<CheckBoxRef>
        ) => React.ReactNode
    );
    return <InputComponet {...props} Component={HtmlCheckBox} rules={rules} ref={ref} />;
}) as ({
    /**
     * Needs to cast to a Function Component so that `Type` type has the effect. If not casted then
     *      <Input type="number" value="a value" ... >
     * will be no type error even though `value` is a string. It should be a number.
     */
    (
        props: CheckBoxProps & React.RefAttributes<CheckBoxRef>
    ): React.ReactNode,

    displayName: 'CheckBox',
});
CheckBox.displayName = 'CheckBox';


type CheckBoxesValue = string | readonly string[];
interface HtmlCheckBoxesRef extends HTMLDivElement {
    focus: () => void,
    value: readonly string[]
}
type HtmlCheckBoxesProps = ElementProps<HtmlCheckBoxesRef, readonly string[]>
    & InputBaseProps<HtmlCheckBoxesRef, readonly string[]>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
export type CheckBoxesProps = Omit<InputProps<HtmlCheckBoxesRef, HtmlCheckBoxesProps, CheckBoxesValue, readonly string[]>, 'Component'>;
export type CheckBoxesRef = HtmlCheckBoxesRef & InputRef;

const HtmlCheckBoxes = React.forwardRef(function HtmlCheckBoxes(
    {className, horizontal, name, onChange, options, style, value = [], ...props}: HtmlCheckBoxesProps,
    ref: React.Ref<HtmlCheckBoxesRef>
) {
    const vals: readonly string[] = Array.isArray(value) ? value : [value];
    const id = React.useId();
    const state = useState(() => {
        const state = {
            ref: null as (HtmlCheckBoxesRef | null),
            refCallback: extRefCallback<HTMLDivElement, Pick<HtmlCheckBoxesRef, 'focus' | 'value'>>(
                ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "core/Validation.tsx"*/
                {
                    focus() {
                        state.ref?.querySelector('input')?.focus();
                    },
                    get value() {
                        const vals: string[] = [];
                        state.ref?.querySelectorAll('input:checked').forEach(
                            item => vals.push((item as HTMLInputElement).value)
                        );
                        return vals;
                    },
                },
                newRef => state.ref = newRef
            ),
        }
        return state;
    });
    
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        if (onChange && state.ref) {
            const event: React.ChangeEvent<HtmlCheckBoxesRef> = extendObject(ev, {
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
    >
        {options.map((option, idx) => (
            opt = typeof(option) == 'string' ? {value: option} : option,
            key = `${id}_${idx}`,
            <span key={key} style={{alignItems: 'center', display:'flex', flex:'none'}}>
                <input
                    id={key}
                    name={name}
                    type='checkbox'
                    value={opt.value}
                    checked={vals.includes(opt.value)}
                    onChange={changeHandler}
                /><label htmlFor={key}>&nbsp;{opt.label ?? opt.value}</label>
            </span>
        ))}
    </div>;
});
HtmlCheckBoxes.displayName = 'HtmlCheckBoxes';
export const CheckBoxes = React.forwardRef(function CheckBoxes(
    {value, ...props}: CheckBoxesProps,
    ref: React.Ref<CheckBoxesRef>
) {
    return <ValidatedInput {...props} value={value as any} Component={HtmlCheckBoxes} ref={ref} />;
});
CheckBoxes.displayName = 'CheckBoxes';