# -*- coding: utf-8 -*-
"""Search_title.xlsx -> titles.json"""
import argparse
import json
from pathlib import Path

import pandas as pd


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--xlsx",
        default=r"D:\[YSKWEB2026]\hwadong_auction_Search_Tool\Search_title.xlsx",
    )
    ap.add_argument("--out", default="titles.json")
    args = ap.parse_args()
    df = pd.read_excel(args.xlsx)
    col = df.columns[0]
    titles = sorted({str(x).strip() for x in df[col].dropna() if str(x).strip()})
    Path(args.out).write_text(
        json.dumps(titles, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"wrote {len(titles)} titles -> {args.out}")


if __name__ == "__main__":
    main()
