#!/usr/bin/env python3
"""
Clone an existing agent folder (e.g. agent15) to a new agent folder (e.g. agent16)
and perform simple textual updates (replace occurrences of the old agent name
with the new one inside text files).

Usage:
  python scripts/clone_agent.py --src agent15 --dst agent16 [--force]

This script is intentionally small and safe for local development. It will
exit if destination exists unless --force is provided.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path
import sys


def is_text_file(path: Path) -> bool:
    # Simple heuristic: check suffix
    text_suffixes = {".py", ".md", ".txt", ".json", ".yaml", ".yml", ".ini"}
    return path.suffix.lower() in text_suffixes


def replace_in_file(path: Path, old: str, new: str) -> None:
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        # skip non-text or unreadable files
        return
    if old in text:
        text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")


def clone_agent(src: Path, dst: Path, force: bool = False) -> int:
    if not src.exists() or not src.is_dir():
        print(f"Source agent folder not found: {src}")
        return 2

    if dst.exists():
        if not force:
            print(f"Destination already exists: {dst} (use --force to overwrite)")
            return 3
        else:
            print(f"Removing existing destination: {dst}")
            shutil.rmtree(dst)

    print(f"Copying {src} -> {dst}")
    shutil.copytree(src, dst)

    # Replace textual occurrences of src name with dst name in text files
    old_name = src.name
    new_name = dst.name
    print(f"Updating internal references: {old_name} -> {new_name}")
    for p in dst.rglob("*"):
        if p.is_file() and is_text_file(p):
            replace_in_file(p, old_name, new_name)

    print("Clone complete.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Clone an agent folder and update names"
    )
    parser.add_argument(
        "--src",
        default="agent15",
        help="Source agent folder name (under current folder)",
    )
    parser.add_argument(
        "--dst", default="agent16", help="Destination agent folder name"
    )
    parser.add_argument(
        "--force", action="store_true", help="Overwrite destination if it exists"
    )
    args = parser.parse_args(argv)

    base = Path(__file__).resolve().parents[1]
    src = base / args.src
    dst = base / args.dst

    return clone_agent(src, dst, force=args.force)


if __name__ == "__main__":
    raise SystemExit(main())
