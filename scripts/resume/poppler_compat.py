#!/usr/bin/env python3
"""pypdfium2 implementation of the two Poppler calls used by pdf2image."""
from __future__ import annotations

import argparse
from pathlib import Path

import pypdfium2 as pdfium
from pypdf import PdfReader


def option(args: list[str], name: str, default: str | None = None) -> str | None:
    try:
        return args[args.index(name) + 1]
    except (ValueError, IndexError):
        return default


def main() -> int:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--tool", required=True)
    ns, raw = parser.parse_known_args()
    pdf_pos = next((i for i, item in enumerate(raw) if item.lower().endswith(".pdf")), None)
    if pdf_pos is None:
        return 2
    pdf = Path(raw[pdf_pos])
    if ns.tool == "pdfinfo":
        print(f"Pages: {len(PdfReader(str(pdf)).pages)}")
        return 0
    if ns.tool != "pdftoppm" or not raw:
        return 2
    # pdf2image builds: pdftoppm -r DPI INPUT.pdf -f N -l N -png OUTPUT_PREFIX
    prefix = Path(raw[-1])
    dpi = float(option(raw, "-r", "180"))
    first = int(option(raw, "-f", "1"))
    last = int(option(raw, "-l", str(len(PdfReader(str(pdf)).pages))))
    document = pdfium.PdfDocument(str(pdf))
    scale = dpi / 72.0
    for page_no in range(first, last + 1):
        page = document[page_no - 1]
        image = page.render(scale=scale).to_pil()
        image.save(f"{prefix}-{page_no:02d}.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
