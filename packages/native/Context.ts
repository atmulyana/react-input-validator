/**
 * https://github.com/atmulyana/react-input-validator
 */
import {StyleSheet, Text, View} from 'react-native';
import {contextFactory} from '@react-input-validator/core';
import {red} from '@react-input-validator/helpers';
import type {StyleProp} from './types';

const defaultStyle = StyleSheet.create({
    errorTextStyle: {
        color: red,
        flex: 0,
        fontFamily: 'Arial',
        fontSize: 12,
        lineHeight: 12,
        marginTop: 2,
    },
    inputErrorStyle: {
        borderColor: red,
        color: red,
    },
});
const {Context, ValidationContext} = contextFactory<StyleProp>({
    Container: View,
    ErrorText: Text,
    ...defaultStyle
});
export {Context, ValidationContext};
