'use client';
/**
 * https://github.com/atmulyana/react-input-validator
 */
import React, {CSSProperties} from 'react';
import {extendObject} from 'javascript-common';
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


//@ts-ignore: we need to define the new type of `value`
export interface CheckBoxRef extends HTMLInputElement {
    type: 'checkbox',
    value: boolean,
}
type CheckBoxProps = Omit<
    React.ComponentProps<'input'>,
    'checked' | 'defaultChecked' | 'defaultValue' | 'onChange' | 'type' | 'ref' | 'style' | 'type' | 'value'
> & {
    onChange?: React.ChangeEventHandler<CheckBoxRef>,
    style?: StyleProp,
    value?: boolean,
};
//@ts-ignore: consider that `HtmlInputRef<Type>` can be casted to `HTMLInputElement`  
type CheckBoxInputProps = InputProps<CheckBoxRef, CheckBoxProps, boolean, boolean>;
type CheckBoxOuterProps = Omit<CheckBoxInputProps, 'Component' | 'rules'> & {rules?: Rules<boolean>};
function checkboxValue(input: HTMLInputElement) {
    return {
        get type() {
            return 'checkbox';
        },
        set type(tp) {
            input.type = 'checkbox';
        },
        get value() {
            return input.checked;
        },
        set value(val) {
            input.checked = !!val;
        },
    }
}
const HtmlCheckBox = React.forwardRef(function HtmlCheckBox(
    {name, onChange, style, value, ...props}: CheckBoxProps,
    ref: React.Ref<CheckBoxRef>
) {
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        if (onChange) {
            const target = ev.target;
            const event = (ev as any) as React.ChangeEvent<CheckBoxRef>;
            event.target = extendObject(target, checkboxValue(target)) as any;
            onChange(event);
        }
    };
    const $ref = extRefCallback<HTMLInputElement, Pick<CheckBoxRef, 'type' | 'value'>>(
        //@ts-ignore: we need to define the new type of `value`
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
        _ref => checkboxValue(_ref)
    );

    return <>
        <input type='hidden' name={name} value={value ? 'true' : 'false'} />
        <input
            {...props}
            ref={$ref}
            checked={value}
            onChange={changeHandler}
            style={style as CSSProperties | undefined /* has been converted by `setStyle` (`setStyleDefault`) in `withValidation` */}
            type='checkbox'
        />
    </>;
});
HtmlCheckBox.displayName = 'HtmlCheckBox';
export const CheckBox = React.forwardRef(function CheckBox(
    {rules = alwaysValid, ...props}: CheckBoxOuterProps,
    ref: React.Ref<CheckBoxRef & InputRef>
) {
    const InputComponet = ValidatedInput as (
        (
            props: CheckBoxInputProps & React.RefAttributes<CheckBoxRef & InputRef>
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
        props: CheckBoxOuterProps & React.RefAttributes<CheckBoxRef & InputRef>
    ): React.ReactNode,

    displayName: 'CheckBox',
});
CheckBox.displayName = 'CheckBox';


type CheckBoxesValue = string | readonly string[];
interface CheckBoxesRef extends HTMLDivElement {
    focus: () => void,
    value: readonly string[]
}
type CheckBoxesProps = ElementProps<CheckBoxesRef, readonly string[]>
    & InputBaseProps<CheckBoxesRef, readonly string[]>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
type CheckBoxesOuterProps = Omit<InputProps<CheckBoxesRef, CheckBoxesProps, CheckBoxesValue, readonly string[]>, 'Component'>;
const HtmlCheckBoxes = React.forwardRef(function HtmlCheckBoxes(
    {className, horizontal, name, onChange, options, style, value = [], ...props}: CheckBoxesProps,
    ref: React.Ref<CheckBoxesRef>
) {
    const id = React.useId();
    const state = useState(() => {
        const state = {
            ref: null as (CheckBoxesRef | null),
            refCallback: extRefCallback<HTMLDivElement, Pick<CheckBoxesRef, 'focus' | 'value'>>(
                ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
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
            const event: React.ChangeEvent<CheckBoxesRef> = extendObject(ev, {
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
                    checked={value.includes(opt.value)}
                    onChange={changeHandler}
                /><label htmlFor={key}>&nbsp;{opt.label ?? opt.value}</label>
            </span>
        ))}
    </div>;
});
HtmlCheckBoxes.displayName = 'HtmlCheckBoxes';
export const CheckBoxes = React.forwardRef(function CheckBoxes(
    {value, ...props}: CheckBoxesOuterProps,
    ref: React.Ref<CheckBoxesRef & InputRef>
) {
    const vals: readonly string[] = Array.isArray(value) ? value :
                                    value ? [value] : [];
    return <ValidatedInput {...props} Component={HtmlCheckBoxes} ref={ref} value={vals} />;
});
CheckBoxes.displayName = 'CheckBoxes';