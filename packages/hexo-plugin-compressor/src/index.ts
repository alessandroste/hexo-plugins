import micromatch from 'micromatch'
import zlib from 'zlib'

if (hexo.config.compress && hexo.config.compress.enabled === true) {
    // gzip compression
    hexo.config.compress.gzip = Object.assign({
        enable: true,
        logger: false,
        include: ['*.html', '*.css', '*.js', '*.txt', '*.ttf', '*.atom', '*.stl', '*.xml', '*.svg', '*.eot', '*.json'],
        globOptions: { matchBase: true }
    }, hexo.config.compress.gzip)

    // brotli compression
    hexo.config.compress.brotli = Object.assign({
        enable: true,
        logger: false,
        include: ['*.html', '*.css', '*.js', '*.txt', '*.ttf', '*.atom', '*.stl', '*.xml', '*.svg', '*.eot', '*.json'],
        globOptions: { matchBase: true }
    }, hexo.config.compress.brotli)

    const gzip = () => {
        const options = hexo.config.compress.gzip
        if (options.enabled === false) return
        const routeList = hexo.route.list()
        micromatch(routeList, options.include, options.globOptions).forEach(r =>
            hexo.route.set(r + '.gz', () =>
                hexo.route.get(r).pipe(zlib.createGzip()))
        )
    }

    const brotli = () => {
        const options = hexo.config.compress.brotli
        if (options.enabled === false) return
        const routeList = hexo.route.list()
        micromatch(routeList, options.include, options.globOptions).forEach(r =>
            hexo.route.set(r + '.br', () =>
                hexo.route.get(r).pipe(zlib.createBrotliCompress()))
        )
    }

    hexo.extend.filter.register('after_generate', gzip)
    hexo.extend.filter.register('after_generate', brotli)
}