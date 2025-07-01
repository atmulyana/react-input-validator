/**
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import type {InputProps, InputRef} from './types';
import {ValidatedInput} from './Validation';


type HtmlTextAreaProps = Omit<
    React.ComponentProps<'textarea'>,
    'defaultChecked' | 'defaultValue' | 'value'
> & {
    value?: string,
};
export type TextAreaProps = Omit<InputProps<HTMLTextAreaElement, HtmlTextAreaProps, string>, 'Component'>;
export type TextAreaRef = HTMLTextAreaElement & InputRef;

const HtmlTextArea = React.forwardRef(function HtmlTextArea(
    props: HtmlTextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>
) {
    return <textarea {...props} ref={ref} />;
});
HtmlTextArea.displayName = 'HtmlTextArea';

export const TextArea = React.forwardRef(function TextArea(
    props: TextAreaProps,
    ref: React.Ref<TextAreaRef>
) {
    return <ValidatedInput {...props} Component={HtmlTextArea} ref={ref} />;
});
TextArea.displayName = 'TextArea';