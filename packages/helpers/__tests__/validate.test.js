/**
 * https://github.com/atmulyana/react-input-validator
 */
import {alwaysValid, length, min, numeric, required, ValidationRule, ValidationRuleAsync} from '@react-input-validator/rules';
import {validate, validateAsync} from '../validate';

let asyncRuleValid = false;
class AsyncRule extends ValidationRuleAsync {
    constructor() {
        super();
        this.setPriority(1);
    }

    get errorMessage() {
        return 'invalid async';
    }

    async validate() {
        return new Promise(resolve => {
            this.isValid = asyncRuleValid;
            setTimeout(
                () => resolve(this),
                300
            );
        })
    }
}

class Rule1 extends ValidationRule {
    validate() {
        return Promise.resolve(this);
    }
}

class Rule2 extends ValidationRuleAsync {
    validate() {
        return Promise.resolve(this);
    }
}

class Rule3 extends ValidationRule {
    validate() {
        this.isValid = !!this.inputValues?.anotherInput;
        return this;
    }
}


test('validation: `validate` with optional rule', () => {
    const rules = [min(5), numeric];
    expect(validate('', rules)).toBe(true);
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});

test('validation: `validate` with `required` rule', () => {
    const rules = [min(5), numeric, required];
    expect(validate('', rules)).toContain('required');
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});

test('validation: `validate` makes next rule consumes `resultValue` of `Required` rule', async () => {
    expect( validate(' a  ', length(2)) ).toBe(true);
    expect( validate(' a  ', [required, length(2)]) ).not.toBe(true);
    expect( validate(' a  ', [alwaysValid, length(2)]) ).not.toBe(true);

    expect( await validateAsync(' a  ', length(2)) ).toBe(true);
    expect( await validateAsync(' a  ', [required, length(2)]) ).not.toBe(true);
    expect( await validateAsync(' a  ', [alwaysValid, length(2)]) ).not.toBe(true);
});

test('validation: `ValidationRuleAsync` is examined at the right order', async () => {
    const rules = [numeric, new AsyncRule(), min(5)];
    asyncRuleValid = false;
    expect(await validateAsync('4', rules)).toBe('invalid async');
    asyncRuleValid = true;
    expect(await validateAsync('4', rules)).toContain('minimum');
});

test('validation: `arrayAsSingle` effect on `validate` call', () => {
    const val1 = ["1", "12", "123"],
          val2 = ["123", "1234"],
          rule = length(3),
          resObj = {};
    
    expect(validate(val1, rule, resObj)).toBe(true);
    expect(resObj.resultValue).toEqual(val1);
    expect(validate(val2, rule)).not.toBe(true);

    rule.arrayAsSingle(false);
    expect(validate(val1, rule)).not.toBe(true);
    expect(validate(val2, rule, resObj)).toBe(true);
    expect(resObj.resultValue).toEqual(val2);
});

test('validation: `validate` with `inputValues` param', () => {
    const param = {
        inputValues: {
            anotherInput: true,
        }
    };
    const rule = new Rule3();
    expect(validate('value', rule)).not.toBe(true);
    expect(validate('value', rule, param)).toBe(true);
    param.inputValues.anotherInput = false;
    expect(validate('value', rule, param)).not.toBe(true);
});

test('validation: `resultValue` of `validate` is trimmed with `Required` rule', () => {
    const param = {
    };
    expect(validate('  value  ', required, param)).toBe(true);
    expect(param.resultValue).toBe('value');
    expect(validate('  ', alwaysValid, param)).toBe(true);
    expect(param.resultValue).toBe('');
});

test('validation: `validate` throws an errow when examining async rule', () => {
    expect( () => validate('123', new Rule1()) )
        .toThrow(/^Call `validateAsync` to process asynchronous validation\. `validate` method of `Rule1` rule returns a `Promise` object\. Also, the rule class doesn't inherit class `ValidationRuleAsync`\.$/);
    expect( () => validate('123', new Rule2()) )
        .toThrow(/^Call `validateAsync` to process asynchronous validation\. `validate` method of `Rule2` rule returns a `Promise` object\.$/);
});