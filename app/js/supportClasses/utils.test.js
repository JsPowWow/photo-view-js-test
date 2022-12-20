import {identity, noop, isDefined} from "./utils";

describe('noop() tests', () => {
    it.each`
    value               | expected
    ${undefined}        | ${undefined}
    ${''}               | ${undefined}
    ${{ foo: 'bar' }}   | ${undefined}
    ${'whatever'}       | ${undefined}
`('noop(\'$value\') returns $expected', ({ value, expected }) => {
        expect((noop(value))).toBe(expected);
    });
});

describe('identity() tests', () => {
    it.each`
    value               | expected
    ${undefined}        | ${undefined}
    ${''}               | ${''}
    ${{ foo: 'bar' }}   | ${{ foo: 'bar' }}
    ${5}                | ${5}
`('identity(\'$value\') returns $expected', ({ value, expected }) => {
        expect(identity(value)).toStrictEqual(expected);
    });
});

describe('isDefined() tests', () => {
    it('Should check provided value for null correct', () => {
        expect(isDefined(null)).toBeFalsy();
    });
    it('Should check provided value for undefined correct', () => {
        expect(isDefined(undefined)).toBeFalsy();
    });
    it('Should check provided value is defined', () => {
        expect(isDefined(0)).toBeTruthy();
        expect(isDefined(5)).toBeTruthy();
        expect(isDefined('')).toBeTruthy();
        expect(isDefined([])).toBeTruthy();
        expect(isDefined({})).toBeTruthy();
    });
});
