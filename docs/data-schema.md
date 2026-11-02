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
    "pe": 38.81, "ps": 10.61, "ev_ebitda": 29.11, "pb": 46.1, "roe": 148.75, "beta": 1.07,
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

## 约定

- 节点码：`板块.环节`，两级；`DEM.*` 是最终需求锚（居民/企业/政府/金融机构），不挂公司。
- 相对倍数全部以 **PE** 为口径（PE 缺失时前端显示 `—`，可用 PS/EV·EBITDA 参考）。
- 加权 PE = Σ市值 ÷ Σ(市值/PE)，比中位数更接近指数口径。
- `confidence`：人工映射的可信度（高/中/低），用于判断该行的上下游归属是否可作为结论。
