/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import * as React from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
} from 'react-native';
import styles from './styles';
import {
    ValidationContext,
    withValidation
} from "@react-input-validator/native";
import {
    email,
    required,
} from '@react-input-validator/rules';

const Input1 = withValidation(TextInput, email);
let Input2 = withValidation(TextInput, {
    auto: false,
    rules: [email, required]
});

export default function AutoPage() {
    const validation = React.useRef(null);
    const [isAuto, setAuto] = React.useState(true);
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('');

    return <ValidationContext ref={validation} auto={isAuto} focusOnInvalid={true}>
        <Text style={styles.title}>Auto Validation</Text>
        <Text style={styles.description}>Enter the email address to both inputs.</Text>

        <View style={styles.inputRow}>
            <Text style={styles.label}>{isAuto ? 'Auto' : 'Not Auto'}</Text>
            <Input1 onChangeText={setValue1} style={styles.textInput} value={value1} />
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>{isAuto ? 'Not Auto' : 'Auto'}</Text>
            <Input2 onChangeText={setValue2} style={styles.textInput} value={value2} />
        </View>
        <View style={[styles.inputRow, {justifyContent: 'space-between'}]}>
            <Button 
                onPress={() => {
                    Input2 = withValidation(TextInput, {
                        auto: isAuto,
                        rules: [email, required]
                    });
                    setAuto(auto => !auto);
                }}
                title="Switch Auto"
            />
            <Button onPress={() => validation.current?.validate()} title="Validate" />
            <Button onPress={() => validation.current?.clearValidation()} title="Clear Validation" />
        </View>
    </ValidationContext>;
}