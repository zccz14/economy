# eco.json 数据结构

```jsonc
{
  "meta": {
    "version": "2026.11.02",
    "as_of": "2026-11-02",                 // 估值快照日
    "universe_zh": "全球市值前 50 家上市公司",
    "universe_en": "Top 50 listed companies by market cap",
    "market_anchor": { "pe_weighted": 20.2, "pe_median": 23.9, "ps_median": 5.68, "ev_ebitda_median": 18.2 },
    "fx": { "CNY": 6.66, "KRW": 1332.8, "TWD": 32.6, "SAR": 3.75, "CHF": 0.82, "EUR": 0.896 },
    "fx_date": "...",
    "sources_zh": ["..."],
    "notes_zh": "..."
  },

  // 产业节点：level=L1 为板块，L2 为可挂公司的环节
  "nodes": [{
    "code": "TEC.CHIP.MEM",        // 板块.环节
    "name_zh": "存储芯片", "name_en": "Memory Chips",
    "level": "L2", "parent": "TEC",
    "def_zh": "DRAM/HBM/NAND",
    "stats": {
      "companies": 4, "mcap_usd_bn": 3294.1,
      "leader_ticker": "005930", "leader_name": "三星电子", "leader_share": 0.342,
      "pe_median": 9.1, "pe_weighted": 8.1, "ps_weighted": 2.9
    }
  }],

  "companies": [{
    "ticker": "AAPL", "name_zh": "苹果", "name_en": "Apple",
    "node": "TEC.CE", "node2": null,
    "sector_zh": "信息技术", "sector_en": "Technology",
    "country_zh": "美国", "country_en": "United States",
    "exchange": "NASDAQ", "isin": "US0378331005", "currency": "USD",
    "mcap_usd_bn": 4937.0,
    "pe": 38.81,        // 市值 ÷ 最新完整财年净利润（财年口径，非 TTM）
    "ps": 10.61,        // 市值 ÷ 财年营业收入
    "pb": 46.1,         // 市值 ÷ 财年股东权益
    "roe": 148.75,      // 净利润 ÷ 股东权益（%）
    "ev_sales": 10.47,  // (市值 + 有息负债 - 现金) ÷ 营业收入
    "ev_ebitda": 29.11, // 仅原始 50 家有数据源 TTM 值，其余为 null
    "beta": 1.07,
    "rel_leader_pe": 1.0,        // ÷ 节点龙头 PE
    "rel_node_pe": 1.0,          // ÷ 节点市值加权 PE
    "rel_market_pe": 1.62,       // ÷ 全样本加权 PE（大盘代理）
    "gross_margin": 0.469, "cogs_ratio": 0.531, "capex_ratio": 0.031,
    "asset_mix": { "financial": 0.5, "ppe": 0.14, "goodwill_intangible": 0.06, "inventory": 0.03 },
    "revenue_segments": [{ "name": "iPhone", "pct": 0.5036 }],
    "downstream": [{ "node": "DEM.HH", "w": 0.78 }],   // 收入端 → 下游节点
    "upstream":   [{ "node": "TEC.EMS", "w": 0.30 }],  // 支出端 → 上游节点
    "biz_zh": "...", "asset_note_zh": "...", "expense_note_zh": "...",
    "confidence": "高",
    "revenue_cur_m": 416161, "assets_cur_m": 359241, "fy_end": "2025-09-27"
  }],

  // 产业图边：upstream node → downstream node，金额为年资金流近似值（十亿美元）
  "edges": [{ "from": "TEC.FOUNDRY", "to": "TEC.CHIP.GPU", "type": "supply", "usd_bn": 41.2 }]
}
```

## 估值口径

扩样后统一改为**报表口径自算**，避免不同公司 TTM 口径不一致：

| 指标 | 公式 |
|---|---|
| PE | 总市值(USD) ÷ 最新完整财年净利润(本币÷汇率) |
| PS | 总市值 ÷ 财年营业收入 |
| PB | 总市值 ÷ 股东权益 |
| ROE | 净利润 ÷ 股东权益 |
| EV/Sales | (市值 + 总负债 − 现金及等价物) ÷ 营业收入 |

- 净利润为负 → PE 显示 `—`（不可比），改用 PS/EV·Sales。
- `ev_ebitda` 仅对早期 50 家保留数据源的 TTM 值，扩样部分为 null。

## 约定

- 节点码：`板块.环节`，两级；`DEM.*` 是最终需求锚（居民/企业/政府/金融机构），不挂公司。
- 相对倍数全部以 **PE** 为口径（PE 缺失时前端显示 `—`，可用 PS/EV·EBITDA 参考）。
- 加权 PE = Σ市值 ÷ Σ(市值/PE)，比中位数更接近指数口径。
- `confidence`：`高/中/低` = 人工逐家映射；`模板` = 由所属产业节点的上下游模板自动继承（可接受，但精度低于人工）。
- 扩样后 `biz_zh` 仅对首批 50 家人工撰写；其余为空，前端回退显示 `biz_en`（数据源英文业务简介）并标注「自动提取」。
