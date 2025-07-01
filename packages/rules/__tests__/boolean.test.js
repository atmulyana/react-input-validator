/**
 * https://github.com/atmulyana/react-input-validator
 */
import {boolean, BooleanValue} from '../boolean';

test('validation: boolean', () => {
    expect(boolean.setValue('not boolean').validate().isValid).toBe(false);
    expect(boolean.setValue(null).validate().isValid).toBe(false);
    expect(boolean.setValue(undefined).validate().isValid).toBe(false);
    expect(boolean.setValue(0).validate().isValid).toBe(false);
    expect(boolean.setValue({}).validate().isValid).toBe(false);
    expect(boolean.setValue('true').validate().isValid).toBe(true);
    expect(boolean.setValue('TRUE').validate().isValid).toBe(true);
    expect(boolean.setValue('false').validate().isValid).toBe(true);
    expect(boolean.setValue('FALSE').validate().isValid).toBe(true);
    expect(boolean.setValue(true).validate().isValid).toBe(true);
    expect(boolean.setValue(false).validate().isValid).toBe(true);
});

test('validation: dissallowing `arrayAsSingle` call on `boolean`', () => {
    expect(() => boolean.arrayAsSingle(true)).toThrow();
    expect(() => new BooleanValue().arrayAsSingle(true)).not.toThrow();
});

test('validation: dissallowing `setMessageFunc` call on `boolean`', () => {
    expect(() => boolean.setMessageFunc(() => '')).toThrow();
    expect(() => new BooleanValue().setMessageFunc(() => '')).not.toThrow();
});

test('validation: dissallowing `setPriority` call on `boolean`', () => {
    expect(() => boolean.setPriority(0)).toThrow();
    expect(() => new BooleanValue().setPriority(0)).not.toThrow();
});