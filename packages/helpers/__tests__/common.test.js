/**
 * https://github.com/atmulyana/react-input-validator
 */
import {max, min, required} from '@react-input-validator/rules';
import {arrayAsSingle} from '../common';

test('helper: `arrayAsSingle` with paramater a single rule', () => {
    const rule = max(5);
    arrayAsSingle(rule);
    expect(rule.isArrayAsSingle).toBe(true);
});

test('helper: `arrayAsSingle` with paramater an array of rules', () => {
    const rules = [min(5), max(10)];
    arrayAsSingle(rules);
    expect(rules[0].isArrayAsSingle).toBe(true);
    expect(rules[1].isArrayAsSingle).toBe(true);
});

test('helper: the use of `arrayAsSingle` second paramater', () => {
    const max5 = max(5);
    expect(arrayAsSingle(max5)).toBe(max5);
    expect(() => arrayAsSingle(required)).not.toThrow();
    expect(arrayAsSingle(required)).not.toBe(required);
    expect(() => arrayAsSingle(required, false)).toThrow();
    expect(() => arrayAsSingle(max5, false)).not.toThrow();
});