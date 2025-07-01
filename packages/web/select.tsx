/**
 * https://github.com/atmulyana/react-input-validator
 */
import React, {CSSProperties} from 'react';
import {emptyString, extendObject} from 'javascript-common';
import {extRefCallback} from 'reactjs-common';
import type {InputProps, InputRef, StyleProp} from './types';
import {ValidatedInput} from './Validation';


type SelectValue<Multiple> = Multiple extends true ? readonly string[] : string;
//@ts-ignore: we need to define the new type of `value`
interface HtmlSelectElement<Multiple extends boolean> extends HTMLSelectElement {
    multiple: Multiple,
    value: SelectValue<Multiple>
}
type HtmlSelectProps<Multiple extends boolean> = Omit<
    React.ComponentProps<'select'>,
    'defaultChecked' | 'defaultValue' | 'multiple' | 'onChange' | 'ref' | 'style' | 'value'
> & {
    multiple?: Multiple,
    onChange?: React.ChangeEventHandler<HtmlSelectElement<NonNullable<Multiple>>>,
    style?: StyleProp,
    value?: SelectValue<Multiple>,
};
type SelectInputProps<Multiple extends (boolean | undefined)> =
    InputProps<
        HtmlSelectElement<NonNullable<Multiple>>,
        //@ts-ignore: consider that `HtmlSelectElement<Multiple>` can be casted to `HTMLSelectElement`
        HtmlSelectProps<NonNullable<Multiple>>,
        SelectValue<Multiple>,
        SelectValue<NonNullable<Multiple>>
    >;
export type SelectProps<Multiple extends (boolean | undefined) = boolean> = Omit<SelectInputProps<Multiple>, 'Component'>;
export type SelectRef<Multiple extends boolean = boolean> = HtmlSelectElement<Multiple> & InputRef;

function selectValue<Multiple>(input: HTMLSelectElement) {
    return {
        get multiple() {
            return input.multiple as NonNullable<Multiple>;
        },
        get value() {
            let val: any;
            if (input.multiple) {
                const vals: any[] = [],
                      opts = input.selectedOptions;
                for (let i = 0; i < opts.length; i++) vals.push(opts[i].value);
                val = vals;
            }
            else {
                val = input.value;
            }
            return val as SelectValue<Multiple>;
        },
        set value(val) {
            const vals = Array.isArray(val) ? (val as string[]) : [val as string];
            const values = new Set(vals)
            for (let i = 0; i < input.options.length; i++) {
                const item = input.options.item(i);
                if (!item) continue;
                item.selected = values.has(item.value);
                if (item.selected && !input.multiple) break; //if not multiple then only one selected
            }
        },
    }
}

const HtmlSelect = React.forwardRef(function HtmlSelect<Multiple extends boolean>(
    {children, multiple, onChange, style, value, ...props}: HtmlSelectProps<Multiple>,
    ref: React.Ref<HtmlSelectElement<Multiple>>
) {
    const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = ev => {
        if (onChange) {
            const target = ev.target;
            const event = ev as React.ChangeEvent<HtmlSelectElement<Multiple>>;
            event.target = extendObject(target, selectValue<Multiple>(target));
            onChange(event);
        }
    };
    const $ref = extRefCallback<HTMLSelectElement, Pick<HtmlSelectElement<Multiple>, 'multiple' | 'value'>>(
        //@ts-ignore: about `value` type ==> we need to define the new type of `value`
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
        _ref => selectValue<Multiple>(_ref)
    );
    return <select
        {...props}
        ref={$ref}
        multiple={multiple}
        onChange={changeHandler}
        style={style as CSSProperties | undefined /* has been converted by `setStyle` (`setStyleDefault`) in `withValidation` */}
        value={
            multiple ? (
                Array.isArray(value) ? value :
                value                ? [value] :
                                       (value ?? []) || [emptyString] 
            ) :
            value
        }
    >
        {children}
    </select>;
});
HtmlSelect.displayName = 'HtmlSelect';

export const Select = React.forwardRef(function Select<Multiple extends (boolean | undefined) = false>(
    props: SelectProps<Multiple>,
    ref: React.Ref<SelectRef<NonNullable<Multiple>>>
) {
    const InputComponet = ValidatedInput as (
        (
            props: SelectInputProps<Multiple> & React.RefAttributes<SelectRef<NonNullable<Multiple>>>
        ) => React.ReactNode
    );
    return <InputComponet {...props} Component={HtmlSelect} ref={ref} />;
}) as ({
    /**
     * Needs to cast to a Function Component so that `Multiple` type has the effect. If not casted then
     *      <Select multiple value="a value" ... >
     * will be no type error even though `value` is a string. It should be an array of string.
     */
    <Multiple extends (boolean | undefined) = false>(
        props: SelectProps<Multiple> & React.RefAttributes<SelectRef<NonNullable<Multiple>>>
    ): React.ReactNode,

    displayName: 'Select',
});
Select.displayName = "Select";