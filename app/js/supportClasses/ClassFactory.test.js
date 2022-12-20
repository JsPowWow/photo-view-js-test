import ClassFactory from "./ClassFactory";

describe('ClassFactory tests', () => {
  class TestClass {
    constructor(a, b) {
      this.a = a;
      this.b = b;
    }
  }

  it("Should throw Error on empty 'generator'", () => {
    expect(() => new ClassFactory(undefined).newInstance()).toThrow(Error);
  });

  it('Should return valid instance', () => {
    const obj = new ClassFactory(TestClass).newInstance();
    expect(obj).toBeInstanceOf(TestClass);
  });

  it('Should adjust provided properties', () => {
    const obj = new ClassFactory(TestClass, { props: { foo: 'bar' } }).newInstance();
    expect(obj).not.toBeUndefined();
    expect(obj).toMatchObject({ foo: 'bar' });
  });

  it('Should adjust provided constructor arguments', () => {
    const obj = new ClassFactory(TestClass, { constructorArgs: [4, 5] }).newInstance();
    expect(obj).not.toBeUndefined();
    expect(obj).toMatchObject({ a: 4, b: 5 });
  });
});
