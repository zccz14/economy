# 产业坐标 · 资产配置树

把「产业是分层的、估值只能相对比较」这套逻辑做成一张可查询的静态图谱：**公司 → 行业龙头 → 行业节点 → 大盘 → 货币/宏观** 四层锚，配合**收入端（下游是谁）/ 支出端（上游是谁）/ 资产端（存量类型）** 三维画像。

线上：<https://economy.ntnl.io>

## 页面

| 路由 | 内容 |
|---|---|
| `#/chain` | 产业链图：上游→下游分层，框面积 ∝ 节点市值，线粗 ∝ 年资金流；点击节点看公司与上下游 |
| `#/compare` | 比较链：每家公司的 PE/PS/EV·EBITDA 与 **vs 龙头 / vs 节点加权 / vs 大盘** 三个相对倍数 |
| `#/nodes` | 节点总览：按合计市值排序，含龙头与集中度 |
| `#/about` | 方法说明与已知局限 |

## 数据

所有数据是一个静态 JSON：`public/data/eco.json`（约 100 KB）。

- 产业位置按**季度**更新即可（行业归属短期内不会变）；
- 估值是单时点快照，随数据文件一起版本化；
- 结构说明见 [`docs/data-schema.md`](docs/data-schema.md)。

更新数据的流程：替换 `public/data/eco.json` → 改 `meta.version` / `meta.as_of` → 提交 PR。

## 开发

```bash
pnpm install
pnpm dev        # 本地开发
pnpm typecheck  # 类型检查
pnpm build      # 产出 dist/
pnpm preview    # 预览构建产物
```

技术栈：TypeScript + Vite + React + Tailwind + shadcn 风格组件 + @tanstack/react-table/react-query + HashRouter。

## 部署

`main` 分支 push 后由 GitHub Actions（`.github/workflows/deploy.yml`）构建并发布到 GitHub Pages，自定义域名 `economy.ntnl.io`（`public/CNAME`）。PR 由 `pr-check` 做类型检查与构建校验。

## 已知局限

- 样本为全球市值前 50 家，多数产业节点只有 1–2 家公司，"龙头"可能即唯一公司；
- 支出端（上游归属）无标准披露数据，为人工映射并标注置信度；
- 资金流为近似值，用于表达量级与方向，不是会计口径。
