
import { IRenderer, RenderOptions } from "@pintora/renderer"
import { DeepPartial, PintoraConfig, pintoraStandalone } from "@pintora/standalone"
import { fork } from 'child_process'
import { JSDOM } from 'jsdom'
import { join } from 'path'
import { mockCanvas } from "./canvas-fix"
import { GlobalPatcher } from "./global-patcher"
import { SubprocessSentMessage } from "./subprocess-render"

export type CLIRenderOptions = {
  code: string
  devicePixelRatio?: number | null
  pintoraConfig?: DeepPartial<PintoraConfig>
  textWidthRatio: number
  background: 'transparent' | 'solid',
  svgClass: string
}

export async function renderInSubprocess(opts: CLIRenderOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const subprocess = fork(join(__dirname, 'subprocess-render'), { stdio: 'inherit' })
    subprocess.on('message', (message: SubprocessSentMessage) => {
      switch (message.type) {
        case 'success': {
          resolve(message.data)
          subprocess.kill()
          break
        }
        case 'error': {
          reject()
          break
        }
      }
    })
    subprocess.send({
      type: 'start',
      opts,
    })
  })
}

function renderPrepare(opts: CLIRenderOptions) {
  const { code, pintoraConfig, devicePixelRatio, textWidthRatio, background } = opts

  const dom = new JSDOM('<!DOCTYPE html><body></body>')
  const document = dom.window.document
  const container = document.createElement('div')
  container.id = 'pintora-container'

  const patcher = new GlobalPatcher()
  patcher.set('window', dom.window)
  patcher.set('document', document)
  global.window = dom.window as never
  global.document = document
  Object.defineProperty(dom.window, "devicePixelRatio", { value: devicePixelRatio })
  mockCanvas(global.window, textWidthRatio)

  return {
    container,
    pintorRender(renderOpts: Pick<RenderOptions, 'renderer'>) {
      const config = pintoraConfig ?
        pintoraStandalone.configApi.gnernateNewConfig(pintoraConfig) :
        pintoraStandalone.configApi.getConfig<PintoraConfig>()
      if (background === 'transparent') {
        config.themeConfig.themeVariables.canvasBackground = undefined
      }

      return new Promise<{ renderer: IRenderer; cleanup(): void }>((resolve, reject) => {
        pintoraStandalone.renderTo(code, {
          container,
          renderer: renderOpts.renderer,
          containerSize: undefined,
          config,
          onRender(renderer) {
            resolve({
              renderer,
              cleanup() {
                patcher.restore()
              },
            })
          },
          onError(e) {
            console.error('onError', e)
            patcher.restore()
            reject(e)
          },
        })
      })
    },
  }
}

/**
 * Renders the Pintora CLI options to the specified output format.
 * @param opts - The CLIRenderOptions.
 * @returns A promise that resolves to the rendered output.
 */
export async function render(opts: CLIRenderOptions): Promise<string> {
  const { pintorRender } = renderPrepare(opts)
  const { renderer, cleanup } = await pintorRender({ renderer: 'svg' })
  const rootElement = renderer.getRootElement() as SVGSVGElement
  rootElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const width = rootElement.getAttribute('width')
  rootElement.setAttribute('width', '100%')
  const height = rootElement.getAttribute('height')
  rootElement.setAttribute('height', 'auto')
  rootElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
  rootElement.setAttribute('class', opts.svgClass)
  const html = rootElement.outerHTML
  cleanup()
  return html
}