/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React, { type CSSProperties } from 'react';
import {
    regex,
    required,
} from '@react-input-validator/rules';
import type {
    ElementProps,
    InputRef,
    ValidationOption
} from '@react-input-validator/web';
import {
    getStyleProps,
    Input
} from '@react-input-validator/web';
import styles from '../styles';

const iconStyles = {
    container: {
        borderRadius: 12,
        boxSizing: 'border-box',
        height: 24,
        padding: 2,
        position: 'absolute',
        right: 3,
        top: 3,
        width: 24,
    } as CSSProperties,
    error: {
        backgroundColor: "red",
    } as CSSProperties,
    image: {
        height: 20,
        stroke:  "white",
        strokeWidth: 4,
        width: 20,
    } as CSSProperties,
    success: {
        backgroundColor: "green",
    } as CSSProperties,
};
const textStyles = {
    inputSuccess: {
        borderColor: 'green',
    } as CSSProperties,
    messageSuccess: {
        color: 'green',
    } as CSSProperties,
};

function Icon({id, style, ...props}: React.ComponentProps<'svg'>) {
    return <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        style={style}
    >
        <use href={`/feather-sprite.svg#${id}`} />
    </svg>;
}

function ValidationStatus({icon, message, style}: {icon: string, message?: string, style: CSSProperties}) {
    return <>
        {/** Not like invalid status, the valid status doesn't show a message.
         *  Here is the place if you want to show a message by using `span` element */}
        {message && <span style={Object.assign({}, styles.text, textStyles.messageSuccess)}>{message}</span>}
        
        {/** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */}
        <span style={Object.assign({}, iconStyles.container, style)}>
            <Icon style={iconStyles.image} id={icon} />
        </span>
    </>
}

const inputOptions: ValidationOption<ElementProps<HTMLInputElement>> = {
    rules: [
        regex(/^0[1-9]\d{2}-\d{4}-\d{4}$/).setMessageFunc(() => 'Bad phone number'),
        required,
    ],
    setStatusStyle: (props, style, context) => {
        if (style) { //invalid status after validate or re-render when invalid
            Object.assign(props, getStyleProps(context.normalStyle, ...style));
            /** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */
            return <ValidationStatus icon='x' style={iconStyles.error} />;
        }
        else if (style === null) {  //valid status after `validate` action
            Object.assign(props, getStyleProps(context.normalStyle, textStyles.inputSuccess, textStyles.messageSuccess));
            context.flag = 1;
            return <ValidationStatus icon='check' message="Good phone number" style={iconStyles.success} />;
        }
        else { //clear action or re-rendering when valid
            if (style === false) {  // re-rendering such as because of editing value
                if (context.flag === 1) { //It's set above when valid after `validate` action
                    /** Not like invalid status which is automatically cleared when starts editing, valid status needs manually clearing */
                    context.clearValidation(); //This method is just to ask to clear in the next/current editing (not really to clear) 
                    context.flag = 0;
                }
            }
            else { //after `clearValidation`
                //When re-rendering, it doesn't need to revert style because it has been done by `setStyle`
                Object.assign(props, getStyleProps(context.normalStyle));
            }
            return null;
        }
    },
};

export default function StatusIconPage() {
    const input = React.useRef<InputRef & HTMLInputElement>(null);
    const inputOnBlur = React.useCallback(() => input.current?.validate(), []);
    const {rules, ...settings} = inputOptions;

    return <div style={styles.form}>
        <h3 style={styles.title}>Validation Status Icon</h3>
        <div style={styles.description}>We'll see more fancy validation status which uses an icon. The input is validated
        when it's lost of focus. Try to enter a valid and invalid phone number to the input (valid pattern:&nbsp;
        <strong style={{whiteSpace: 'nowrap'}}>0[1-9]dd-dddd-dddd</strong>)
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Phone Number</label>
            <Input ref={input} autoComplete='off' onBlur={inputOnBlur} rules={rules} settings={settings} style={styles.textInput1} />
            <div style={styles.flex2}>&nbsp;</div>
        </div>

        <div style={styles.inputRow}>
            <div style={styles.flex1}>&nbsp;</div>
            <div style={Object.assign({justifyContent: 'flex-end'}, styles.flex1, styles.horizontal)}>
                <button type='button' style={styles.text} onClick={() => input.current?.clearValidation()}>Clear Validation</button>
            </div>
            <div style={styles.flex2}>&nbsp;</div>
        </div>
    </div>;
}