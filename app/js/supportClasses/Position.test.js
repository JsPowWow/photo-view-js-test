import Position from "./Position";

describe("Position tests", () => {
    it("Should initialized correct by default", () => {
        expect(new Position().x).toBe(0);
        expect(new Position().y).toBe(0);
    });
    it("Should reset with provided values", () => {
        const pos = new Position();
        expect(pos.reset({x: 10, y:40})).toMatchObject({x: 10, y:40});
    });
    it("Should reset with zero values by default", () => {
        const pos = new Position().reset({x: 10, y:40});
        expect(pos.reset()).toMatchObject({x: 0, y:0});
    });
});
