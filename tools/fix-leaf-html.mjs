// 构建后处理：为 VitePress 生成的「叶子页 X.html」在同目录补一个
// 极小的 X/index.html 重定向页，指向 ../X.html。
// 原因：GitHub Pages 对 /X/ 只会找 X/index.html，找不到就 404；
// 而 VitePress 对没有子页面的叶子页只生成 X.html。站内 SPA 导航不受影响。
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, relative, basename, extname } from 'node:path'

const dist = process.argv[2] || 'docs/.vitepress/dist'
let created = 0
let skipped = 0

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e)
    const s = statSync(f)
    if (s.isDirectory()) {
      walk(f)
      continue
    }
    if (extname(f) !== '.html') continue
    const n = basename(f, '.html')
    if (n === 'index' || n === '404') {
      skipped++
      continue
    }
    const t = join(dirname(f), n, 'index.html')
    if (existsSync(t)) {
      skipped++
      continue
    }
    mkdirSync(join(dirname(f), n), { recursive: true })
    const rel = relative(join(dirname(f), n), f).split('\\').join('/')
    writeFileSync(
      t,
      `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">` +
        `<title>正在跳转…</title><meta http-equiv="refresh" content="0; url=${rel}"></head>` +
        `<body><p>正在跳转到 <a href="${rel}">文档页面</a>…</p>` +
        `<script>location.replace("${rel}")</script></body></html>`
    )
    created++
  }
}

walk(dist)
console.log(`[fix-leaf-html] 新建 ${created} 个重定向 index.html，跳过 ${skipped} 个`)
