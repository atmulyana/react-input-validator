/**
 * https://github.com/atmulyana/react-input-validator
 */
import {numeric, Numeric} from '../numeric';

test('validation: numeric', () => {
    expect(numeric.setValue('.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-.2').validate().isValid).toBe(true);
    expect(numeric.setValue('1.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-1.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-123').validate().isValid).toBe(true);
    expect(numeric.setValue('123').validate().isValid).toBe(true);
    expect(numeric.setValue('+123').validate().isValid).toBe(true);
    expect(numeric.setValue('123abc').validate().isValid).toBe(false);
    expect(numeric.setValue('').validate().isValid).toBe(false);
});

test('validation: dissallowing `arrayAsSingle` call on `numeric`', () => {
    expect(() => numeric.arrayAsSingle(true)).toThrow();
    expect(() => new Numeric().arrayAsSingle(true)).not.toThrow();
});

test('validation: dissallowing setMessageFunc call on `numeric`', () => {
    expect(() => numeric.setMessageFunc(() => '')).toThrow();
    expect(() => new Numeric().setMessageFunc(() => '')).not.toThrow();
});

test('validation: dissallowing setPriority call on `numeric`', () => {
    expect(() => numeric.setPriority(0)).toThrow();
    expect(() => new Numeric().setPriority(0)).not.toThrow();
});