import CanvasView from "./CanvasView";
import {identity, noop, waitFor} from "../supportClasses/utils";

describe('CanvasView tests', () => {
    let image
    let canvasElement
    let canvasView
    let canvasContextDrawImageSpy
    beforeEach(() => {
        document.body.innerHTML =
            '<div>' +
            '  <canvas id="tstCanvas" style="width: 110px"></canvas>' +
            '</div>';
        image = new Image();
        jest.spyOn(image, 'naturalWidth', 'get').mockReturnValue(220);
        jest.spyOn(image, 'naturalHeight', 'get').mockReturnValue(110);
        canvasElement = document.getElementById("tstCanvas");
        canvasContextDrawImageSpy = jest.fn().mockImplementation(noop)
        canvasView = new CanvasView().withElement(canvasElement)
        jest.spyOn(canvasElement, 'getContext').mockReturnValue({
            drawImage: canvasContextDrawImageSpy,
        });
        // cleanup spy/mocks are performed by "clearMocks: true" of jest configuration
    })
    it('Should initialized correct', () => {
        expect(canvasView.canvas).not.toBeUndefined();
        expect(canvasView.topLeft.x).toBe(0);
        expect(canvasView.topLeft.y).toBe(0);
    });
    it('Should adjust canvas logical size per provided Image', () => {
        canvasView.drawFromImage(image);
        expect(canvasView.canvas.width).toBe(220);
        expect(canvasView.canvas.height).toBe(146); // img width * 10 / 15
    })
    it('Should invalidate / validate draw infos correct', async () => {
        expect.assertions(2);
        const spyOnInvalidate = jest.spyOn(canvasView, 'invalidate');
        const spyOnValidate = jest.spyOn(canvasView, 'validate');
        canvasView.drawFromImage(image);
        canvasView.drawFromImage(image);
        canvasView.drawFromImage(image);
        expect(spyOnInvalidate).toHaveBeenCalledTimes(3);
        await waitFor(200);
        expect(spyOnValidate).toHaveBeenCalledTimes(1);
    })
    it('Should draw image with default infos', async () => {
        expect.assertions(1);
        canvasView.drawFromImage(image);
        await waitFor(200);
        expect(canvasContextDrawImageSpy).toHaveBeenCalledWith(
            expect.any(HTMLImageElement),
            0, 0, // x,y of image
            220, 110 // natural size of image
        );
    })
    it('Should call "onValidate" callback', async () => {
        expect.assertions(1);
        const spyForValidate = jest.fn().mockImplementation(identity)
        canvasView.drawFromImage(image, {x: 33, y: 44, onValidate: spyForValidate});
        await waitFor(200);
        expect(spyForValidate).toHaveBeenCalledWith({
            canvas: expect.any(HTMLCanvasElement),
            image: expect.any(HTMLImageElement),
            x: 33, y: 44, width: 220, height: 110, // image rect
        })
    })
    it('Should draw image with provided backs "onValidate" info(s)', async () => {
        expect.assertions(1);
        canvasView.drawFromImage(image, {
            x: 33, y: 44, onValidate: (drawInfos) => {
                return {...drawInfos, ...{x: 50, y: 60, width: 100, height: 300}}
            }
        });
        await waitFor(200);
        expect(canvasContextDrawImageSpy).toHaveBeenCalledWith(
            expect.any(HTMLImageElement),
            50, 60, 100, 300, // image rect
        )
    })
});
