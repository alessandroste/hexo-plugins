export function mockCanvas(window, textRatio: number) {
  window.HTMLCanvasElement.prototype.getContext = function () {
    return {
      measureText: function (text: string) {
        return { width: text.length * textRatio }
      },
    }
  }
}