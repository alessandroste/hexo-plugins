import { CLIRenderOptions, renderInSubprocess } from "./render"

type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]}
type PluginConfig = Omit<CLIRenderOptions, "code">
type PluginArgs = PickByType<PluginConfig, string | number | null>

hexo.extend.tag.register("pintora", async (args: string[], content) => {
  const config: PluginConfig = hexo.config['pintora']

  const mappedArgs: Partial<PluginArgs> = args.reduce((acc, arg) => {
    const [key, value] = arg.split(':')
    const typedKey = key as keyof PluginArgs
    if (typedKey) {
      acc[typedKey] = value
    } else {
      hexo.log.warn(`Unexpected config '${key}'`)
    }
    return acc
  }, {})

  const defaultConfig: PluginConfig = {
    pintoraConfig: {
      themeConfig: {
        theme: 'default',
        themeVariables: {
          canvasBackground: undefined
        }
      }
    },
    background: 'transparent',
    devicePixelRatio: 2,
    textWidthRatio: 9,
    svgClass: 'diagram'
  }

  return await renderInSubprocess({
    code: content,
    ...defaultConfig,
    ...config,
    ...mappedArgs
  })
}, { ends: true, async: true })