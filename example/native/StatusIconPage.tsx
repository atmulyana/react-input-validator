/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
    type ViewStyle,
} from 'react-native';
import type {SvgProps} from 'react-native-svg';
import {Check, X} from "react-native-feather";
import {
    type InputRef,
    withValidation
} from "@react-input-validator/native";
import {
    regex,
    required,
} from '@react-input-validator/rules';
import styles from './styles';

const iconStyles = {
    container: {
        borderRadius: 10,
        height: 20,
        padding: 2,
        position: 'absolute',
        right: 2,
        top: 2,
        width: 20,
    } as ViewStyle,
    error: {
        backgroundColor: "red",
    },
    image: {
        height: 16,
        stroke:  "white",
        strokeWidth: 4,
        width: 16,
    },
    success: {
        backgroundColor: "green",
    },
};
const textStyles = {
    inputSuccess: {
        borderColor: 'green',
    },
    message: {
        color: 'green',
    },
};

type TIcon = React.ComponentType<SvgProps>;

function ValidationStatus({
    icon: Icon,
    message,
    style
}: {
    icon: TIcon,
    message?: string
    style?: ViewStyle,
}) {
    return <>
        {/** Not like invalid status, the valid status doesn't show a message.
         *  Here is the place if you want to show a message by using `Text` element */}
        {message && <Text style={[styles.text, textStyles.message]}>{message}</Text>}
        
        {/** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */}
        <View style={[iconStyles.container, style]}>
            <Icon {...iconStyles.image} />
        </View>
    </>;
}

const Input = withValidation(TextInput, {
    //auto: true,
    rules: [
        regex(/^0[1-9]\d{2}-\d{4}-\d{4}$/).setMessageFunc(() => 'Bad phone number'),
        required,
    ],
    setStatusStyle: (props, style, context) => {
        if (style) { //invalid status after validate or re-render when invalid
            props.style = [context.normalStyle, style];
            /** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */
            return <ValidationStatus icon={X} style={iconStyles.error} />;
        }
        else if (style === null) {  //valid status after `validate` action
            props.style = [context.normalStyle, textStyles.inputSuccess];
            context.flag = 1;
            return <ValidationStatus icon={Check} message="Good phone number" style={iconStyles.success} />;
        }
        else { //clear action or re-rendering when valid
            if (style === false) { // re-render such as because of editing value
                if (context.flag === 1) { //It's set above when valid after `validate` action
                    /** Not like invalid status which is automatically cleared when starts editing, valid status needs manually clearing */
                    context.clearValidation();
                    context.flag = 0;
                }
            }
            else { //after `clearValidation`
                //When re-rendering, it doesn't need to revert style because it has been done by `setStyle`
                props.style = context.normalStyle;
            }
            return null;
        }
    },
});

export default function() {
    const input = React.useRef<InputRef & TextInput>(null);
    const [value, setValue] = React.useState('');
    const inputOnBlur = React.useCallback(() => input.current?.validate(), []);

    return <>
        <Text style={styles.title as any}>Validation Status Icon</Text>
        <Text style={styles.description}>We'll see more fancy validation status which uses an icon. The input is validated
        when it's lost of focus (For iOS, if it can't remove focus from TextInput, please change the source code to enable auto option). Try to enter a valid
        and invalid phone number to the input (valid pattern:{' '}
        <Text style={{fontWeight:'bold'}}>0[1-9]dd-dddd-dddd</Text>).</Text>

        <View style={styles.inputRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Input ref={input} autoCorrect={false} onBlur={inputOnBlur} onChangeText={setValue} style={styles.textInput} value={value} />
        </View>
        <View style={[styles.inputRow, {justifyContent: 'flex-end'}]}>
            <Button onPress={() => input.current?.clearValidation()} title="Clear Validation" />
        </View>
    </>;
}