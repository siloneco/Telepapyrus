import sizeOf from 'image-size'
import { visit } from 'unist-util-visit'
import NodeCache from 'node-cache'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'

const cache = new NodeCache()
const cacheTTL = 60 * 60 * 24 // 1 day

const cacheImageSize = (src: string) => {
  fetch(src)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer))
    .then((buffer) => sizeOf(buffer))
    .then((size) => cache.set(src, size, cacheTTL))
}

export const rehypeImageSizeCache = () => {
  return (tree: any, _file: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') {
        return true
      }

      const src = node.properties.src

      const size = cache.get<ISizeCalculationResult>(src)
      if (
        size !== undefined &&
        size.width !== undefined &&
        size.height !== undefined
      ) {
        const { width, height } = size

        node.properties.width = width
        node.properties.height = height
        return
      }

      cacheImageSize(src)
      return
    })
  }
}
