/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import * as React from 'react';
import {
    Button,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type {
    TextInputProps
} from 'react-native/Libraries/Components/TextInput/TextInput';
import type {
    StyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
    TextStyle,
    ViewStyle,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import JsSimpleDateFormat from 'jssimpledateformat';
import CheckBox from './CheckBox'; // '@react-native-community/checkbox';
import RNDatePicker, {
    type AndroidNativeProps,
    type DateTimePickerEvent,
    type IOSNativeProps,
} from '@react-native-community/datetimepicker';
import {Calendar as CalendarIcon} from 'react-native-feather';
import {select, option} from 'rn-select-option';
const Select = select<string>(), Option = option<string>();
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {
    type ContextRef,
    red,
    Validation,
    ValidationContext,
    withValidation,
} from "@react-input-validator/native";
import {
    integer,
    max,
    min,
    numeric,
    regex,
    required,
    rule,
} from '@react-input-validator/rules';
import styles from './styles';

const genderOptions = [
    {value: 'M', label: 'Male'},
    {value: 'F', label: 'Female'},
];

export default function BasicPage() {
    const validation = React.useRef<ContextRef>(null);
    
    const [name, setName] = React.useState({
        first: '',
        middle: '',
        last: '',
    });
    const onNameChange = {
        first: React.useCallback((first: string) => setName({...name, first}), [name]),
        middle: React.useCallback((middle: string) => setName({...name, middle}), [name]),
        last: React.useCallback((last: string) => setName({...name, last}), [name]),
    };

    const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(addYear(new Date(), -20)); //set initial invalid value
    const dobOnChange = React.useCallback((_: DateTimePickerEvent, date?: Date) => setDateOfBirth(date), []);
    const [gender, setGender] = React.useState(null);
    const [childCount, setChildCount] = React.useState('');
    const [domicile, setDomicile] = React.useState('');
    const [transport, setTransport] = React.useState('');
    const [confirm, setConfirm] = React.useState(false);

    const TransportInput = withValidation(Select, {
        name: 'Transportation',
        getValue: props => (props as any).selectedValue,
        rules: [
            rule(
                value => {
                    if (value == 'foot') {
                        return domicile == 'center' || domicile === '';
                    }
                    return true;
                },
                "It's impossible to go to the office on foot based the selected domicile"
            ),
            required,
        ],
    });
    
    return <ValidationContext ref={validation}>
        {/*@ts-ignore*/}
        <Text style={styles.title}>Employee Data Form</Text>
        <Text style={styles.description}>It's a weird employee data form but, here, we're focusing on how the input validation works.</Text>

        <View style={styles.inputRow}>
            <Text style={[styles.label, {paddingTop: 16}]}>Full Name</Text>
            <FullName onChange={onNameChange} value={name} />
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.flex3}>
                <DateOfBirthInput onChange={dobOnChange} value={dateOfBirth} />
            </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.flex3}>
                <RequiredOptions onPress={setGender} options={genderOptions} style={styles.textPaddingVert} value={gender} />
            </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Number of Children</Text>
            <ChildrenInput onChangeText={setChildCount} style={styles.flex3} value={childCount} />
        </View>
        <View style={styles.inputRow}>
            <Text style={[styles.label]}>Domicile</Text>
            <View style={styles.flex3}>
                <DomicileInput
                    onValueChange={setDomicile}
                    selectedValue={domicile}
                    style={[styles.border, styles.text, styles.textInputHeight]}
                    itemStyle={styles.pickerItem}
                >
                    <Option label="--Please Choose--" value="" style={styles.pickerItem} />
                    <Option label="Center Area" value="center" style={styles.pickerItem} />
                    <Option label="East Area" value="east" style={styles.pickerItem} />
                    <Option label="North Area" value="north" style={styles.pickerItem} />
                    <Option label="South Area" value="south" style={styles.pickerItem} />
                    <Option label="West Area" value="west" style={styles.pickerItem} />
                </DomicileInput>
            </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={[styles.label]}>How to go to office</Text>
            <View style={styles.flex3}>
                <TransportInput
                    onValueChange={setTransport}
                    selectedValue={transport}
                    style={[styles.border, styles.text, styles.textInputHeight]}
                    itemStyle={styles.pickerItem}
                >
                    <Option label="--Please Choose--" value="" style={styles.pickerItem} />
                    <Option label="Public Transportation" value="public" style={styles.pickerItem} />
                    <Option label="Private Vehicle" value="private" style={styles.pickerItem} />
                    <Option label="On Foot" value="foot" style={styles.pickerItem} />
                </TransportInput>
            </View>
        </View>
        
        <View style={styles.inputRow}>
            <View style={styles.flex1} />
            <View style={styles.flex3}>
                <View style={[styles.horizontal, styles.itemCenter]}>
                    <CheckBox 
                        boxType="square"
                        onCheckColor="black"
                        onValueChange={setConfirm}
                        tintColors={{false:styles.border.borderColor}} tintColor={styles.border.borderColor}
                        style={styles.border}
                        value={confirm}
                    />
                    <Text style={[styles.text, {marginLeft: 4}]}>All data I filled above is true</Text>
                </View>
                <Validation
                    rules={rule(
                        checked => !!checked,
                        'You must check this statement'
                    )}
                    value={confirm}
                />
            </View>
        </View>
        <View style={styles.inputRow}>
            <View style={styles.flex1} />
            <View style={[styles.flex3, styles.horizontal, styles.buttonContainer]}>
                <Button onPress={() => validation.current?.validate()} title="Validate" />
                <Button onPress={() => validation.current?.clearValidation()} title="Clear Validation" />
            </View>
        </View>
    </ValidationContext>;
};

const RequiredNameInput = withValidation(TextInput, {
    rules: [
        required,
        regex(/^[a-zA-Z]+$/),
    ],
});

const MiddleNameInput = withValidation(TextInput, {
    rules: regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/),
});

type ChangeTextHandler = (text: string) => void;

/** It's not necessary to create the separated components to show the input of name. Here, however, we're testing the nested inputs.*/
class FullName extends React.PureComponent<{
    onChange?: {
        first: ChangeTextHandler,
        middle: ChangeTextHandler,
        last: ChangeTextHandler,
    },
    value?: {
        first: string,
        middle: string,
        last: string,
    },
}> {
    render() {
        const {onChange, value} = this.props;
        return (
            <View style={styles.name}>
                <NamePart Input={RequiredNameInput} onChange={onChange?.first} style={styles.flex1} title="First" value={value?.first} />
                <NamePart Input={MiddleNameInput} onChange={onChange?.middle} style={styles.flex1} title="Middle" value={value?.middle} />
                <NamePart Input={RequiredNameInput} onChange={onChange?.last} style={styles.flex1} title="Last" value={value?.last} />
            </View>
        );
    }
}
class NamePart extends React.PureComponent<{
    Input: React.ComponentType<TextInputProps>,
    onChange?: ChangeTextHandler,
    style: ViewStyle,
    title: string,
    value?: string,
}> {
    static defaultProps = {
        Input: TextInput,
    };

    render() {
        const props = this.props;
        return(
            <View style={props.style}>
                <Text style={styles.namePartTitle}>{props.title}</Text>
                <props.Input onChangeText={props.onChange} style={styles.textInput} value={props.value} />
            </View>
        );
    }
}

const dtSimlatePressEvent: DateTimePickerEvent = {
    type: "neutralButtonPressed",
    nativeEvent: {
        timestamp: 0,
        utcOffset: 0,
    },
}
const Calendar = Platform.OS == 'android'
    ? (props: AndroidNativeProps) => <RNDatePicker display="calendar" {...props} />
    
    : (props: IOSNativeProps) => {
        let value = props.value;
        return <Modal transparent={true}>
            <View style={[StyleSheet.absoluteFill, {alignItems: 'center', justifyContent: 'center'}]}>
                <TouchableOpacity
                    onPress={() => props.onChange && props.onChange(dtSimlatePressEvent, props.value)}
                    style={[StyleSheet.absoluteFill, {backgroundColor: 'black', opacity: 0.5}]}
                />
                <RNDatePicker {...props}
                    display="inline"
                    onChange={(event, date) => {
                        if (!date) return;
                        if (date.getFullYear() == value.getFullYear() && date.getMonth() == value.getMonth()) {
                            if (props.onChange) props.onChange(event, date);
                        }
                        else {
                            //The users pick a new year/month but not necessarily intend to close calendar
                        }
                        value = date;
                    }}
                    style={[{backgroundColor: 'white', height: 400, width: 350}, props.style]}
                />
                <View style={{flexDirection: 'row', justifyContent:'flex-end', width:350}}>
                    <Text
                        onPress={() => props.onChange && props.onChange(dtSimlatePressEvent, props.value)}
                        style={{backgroundColor: 'white', color:'#307df6', fontWeight:'bold', paddingHorizontal:10, paddingVertical:2}}
                    >CANCEL</Text>
                    <Text
                        onPress={() => props.onChange && props.onChange(dtSimlatePressEvent, value)}
                        style={{backgroundColor: 'white', color:'#307df6', fontWeight:'bold', paddingHorizontal:10, paddingVertical:2}}
                    >OK</Text>
                </View>
            </View>
        </Modal>;
    };

const dateFormatter = new JsSimpleDateFormat("MMMM d, yyyy");

const DatePicker = React.memo(function({
    onChange,
    style,
    value,
    ...props
}: {
    onChange?: (event: DateTimePickerEvent, date?: Date) => void,
    style?: any,
    value?: Date,
}) {
    const dtValue = value ?? new Date();
    const iconSize = 16;
    const [iconStyle, setIconStyle] = React.useState<ViewStyle>({
        alignItems: 'center',
        backgroundColor: styles.border.borderColor,
        borderBottomLeftRadius: styles.border.borderRadius,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: styles.border.borderRadius,
        borderTopRightRadius: 0,
        display: 'none',
        height: styles.textInputHeight.height - 2,
        justifyContent: 'center',
        position: 'absolute',
        width: styles.textInputHeight.height - 2,
    });
    const [calendarVisible, setCalendarVisible] = React.useState(false);
    const onChangeHandler = React.useCallback((event: DateTimePickerEvent, date?: Date) => {
        setCalendarVisible(false);
        if (onChange) {
            let dateWithoutTime = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined;
            onChange(event, dateWithoutTime);
        }
    }, [onChange]);
    const showCalendar = React.useCallback(() => setCalendarVisible(true), []);

    return (
        <>
            <Text
                onPress={showCalendar}
                style={[styles.textBorder, {paddingLeft: styles.textInputHeight.height + 4}, style]}
                onLayout={({nativeEvent: {layout}}) => {
                    setIconStyle(style => ({...style, display: 'flex', left: layout.x + 1, top: layout.y + 1}));
                }}
            >
                {dateFormatter.format(dtValue)}
            </Text>
            <TouchableOpacity style={iconStyle} onPress={showCalendar}>
                <CalendarIcon height={iconSize} stroke="black" width={iconSize} />
            </TouchableOpacity>
            {calendarVisible && <Calendar onChange={onChangeHandler} value={dtValue} {...props} />}
        </>
    );
});

function addYear(date: Date, yearsToAdd: number): Date {
    let year = date.getFullYear() + yearsToAdd;
    return new Date(year, date.getMonth(), date.getDate());
}

const DateOfBirthInput = withValidation(DatePicker, {
    rules: [
        required,
        max(() => addYear(new Date(), -21)).setMessageFunc(() => 'The employee must be at least 21 years old'),
        min(() => addYear(new Date(), -60)).setMessageFunc(() => 'The employee must be retired at 60 years old'),
    ],
});


const RadioButtons = React.memo(({
    inputProps = {},
    labelProps = {},
    options,
    value,
    onPress,
    style
}: {
    inputProps?: Partial<React.ComponentProps<typeof RadioButtonInput>>,
    labelProps?: Partial<React.ComponentProps<typeof RadioButtonLabel>>,
    options: {value: any}[],
    value?: any,
    onPress?: (val?: any) => any,
    style?: StyleProp<ViewStyle>,
}) =>
    <RadioForm
        formHorizontal={true}
        animation={true}
        style={[{marginLeft: -10, paddingBottom: 0}, style]}
    >
        {options.map((obj, i) => (
            <RadioButton labelHorizontal={true} key={i} style={{marginBottom: 0}}>
                <RadioButtonInput
                    {...inputProps}
                    obj={obj}
                    index={i}
                    isSelected={value === obj.value}
                    onPress={() => onPress && onPress(obj.value)}
                    buttonInnerColor={inputProps?.buttonInnerColor ?? 'black'}
                    buttonOuterColor={inputProps?.buttonOuterColor ?? 'black'}
                    buttonSize={styles.text.fontSize - 3}
                    buttonOuterSize={styles.text.fontSize}
                    // buttonStyle={{}}
                    buttonWrapStyle={{marginLeft: 10}}
                />
                <RadioButtonLabel
                    {...labelProps}
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={() => onPress && onPress(obj.value)}
                    labelStyle={labelProps?.labelStyle ?? styles.textSlim}
                    // labelWrapStyle={{}}
                />
            </RadioButton>
        ))}  
    </RadioForm>
);
const RequiredOptions = withValidation(RadioButtons, {
    rules: required,
    setStatusStyle: (props: React.ComponentProps<typeof RadioButtons>, style: StyleProp<TextStyle>) => {
        if (style) {
            const styleObj: TextStyle = StyleSheet.flatten(style);
            if (styleObj) {
                props.inputProps = {
                    ...props.inputProps,
                    buttonInnerColor: typeof(styleObj.color) == 'string' ? styleObj.color : undefined,
                    buttonOuterColor: typeof(styleObj.borderColor) == 'string' ? styleObj.borderColor : undefined,
                };
                props.labelProps = {
                    ...props.labelProps,
                    labelStyle: [styles.textSlim, {color: styleObj.color}],
                };
            }
        }
        else {
            delete props.inputProps;
            delete props.labelProps;
        }
        return null;
    },
});


function ChildsInput({style, ...props}: React.ComponentProps<typeof TextInput> & {style?: StyleProp<ViewStyle>}) {
    const inputStyle: {flex: 0, width: 40, color?: string, borderColor?: string} = {flex: 0, width: 40};
    if (Array.isArray(style)) { //invalid status
        inputStyle.color = red;
        inputStyle.borderColor = red;
    }

    return <View style={style}>
        <TextInput
            {...props}
            maxLength={3}
            style={[
                styles.textInput,
                inputStyle,
            ]} />
    </View>;
}
const ChildrenInput = withValidation(ChildsInput, {
    rules: [
        numeric,
        integer,
        min(0),
        max(4).setMessageFunc(() => 'Maximum 4 children who get allowance'),
    ],
});

const DomicileInput = withValidation(Select, {
    getValue: props => (props as any).selectedValue,
    rules: required,
});