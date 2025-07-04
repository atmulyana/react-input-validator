/**
 * https://github.com/atmulyana/react-input-validator
 */
import {act, cleanup, render, screen} from '@testing-library/react-native';
import {required} from '@react-input-validator/rules';
import {StyleSheet, Text, TextInput, View} from "react-native";
import {withValidation} from "../Validation";

const Input = withValidation(TextInput, {
    rules: [required],
});

let inputRef;
const Form = () =>
    <View style={StyleSheet.absoluteFill}>
        <Input ref={ref => inputRef = ref}
            testID="input"
            style={{
                borderColor: 'gray',
                borderWidth: 1,
                height: 20,
                width: 100
            }} />
    </View>;

afterEach(cleanup);

test('render input `withValidation`', () => {
    render(<Form />);

    //expect(screen.toJSON()).toMatchSnapshot();

    const form = screen.root;
    const input = form.findByType(TextInput);
    const inputContainer = input.parent;
    //const inputRef = input.instance;

    expect(inputContainer.props.style).toEqual({width: 100});
    expect(input.props.style).toEqual({
        borderColor: 'gray',
        borderWidth: 1,
        height: 20,
    });
    expect(input.props.testID).toBe('input');

    expect(inputRef).not.toBeFalsy();

    expect(typeof inputRef.clearValidation).toBe('function');
    expect(typeof inputRef.getErrorMessage).toBe('function');
    expect(typeof inputRef.setErrorMessage).toBe('function');
    expect(typeof inputRef.validate).toBe('function');
    expect(typeof inputRef.validateAsync).toBe('function');
    expect(inputRef.name).toBeUndefined();
    expect(inputRef.isValid).toBe(true);

    act(() => {
        inputRef.validate();
    });
    expect(inputRef.isValid).toBe(false);
    expect(inputRef.getErrorMessage()).toBe('required');
    expect(inputContainer.children[1]?.type).toBe(Text);
    expect(inputContainer.children[1].props.children).toBe('required');
    expect(StyleSheet.flatten(input.props.style).borderColor).not.toBe('gray'); //red

    act(() => {
        inputRef.clearValidation();
    });
    expect(inputRef.isValid).toBe(true);
    expect(inputRef.getErrorMessage()).toBe('');
    expect(inputContainer.children[1]).toBeUndefined();
    expect(input.props.style.borderColor).toBe('gray');
});

test('`withValidation` should return the original Input if no rule defined', () => {
    let Input = withValidation(TextInput); //`option` is not defined
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, true); //`option` is not object (invalid)
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, {}); //`option` object doesn't define any rule
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, {rules: true}); //`option` object  defines invalid rules
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, {rules: []}); //`option` object defines rules as empty array (no rule)
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, {rules: [new Date()]}); //`option` object defines no valid rule in rules array
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, []); //`option` as empty array (no rule)
    expect(Input).toBe(TextInput);

    Input = withValidation(TextInput, [new Date()]); //`option` as non-empty array but conatins no valid rule
    expect(Input).toBe(TextInput);
});