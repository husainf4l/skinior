import asyncio
import pytest

from fastapi_app import main


class FakeRecord:
    def __init__(self, data):
        self._d = data

    def get(self, k, default=None):
        return self._d.get(k, default)

    def __getitem__(self, k):
        return self._d[k]

    def keys(self):
        return self._d.keys()

    def items(self):
        return self._d.items()

    def __iter__(self):
        return iter(self._d)


class FakeConn:
    def __init__(self, rows=None, row=None):
        self._rows = rows or []
        self._row = row

    async def fetch(self, sql, limit):
        # ignore sql; return pre-set list
        return self._rows

    async def fetchrow(self, sql, *args):
        return self._row


class FakePool:
    def __init__(self, conn):
        self._conn = conn

    def acquire(self):
        pool = self

        class Ctx:
            def __init__(self, conn):
                self._conn = conn

            async def __aenter__(self):
                return self._conn

            async def __aexit__(self, exc_type, exc, tb):
                return False

        return Ctx(self._conn)


@pytest.mark.asyncio
async def test_quote_ident():
    assert main._quote_ident("col") == '"col"'
    assert main._quote_ident('weird"name') == '"weird""name"'


@pytest.mark.asyncio
async def test_db_find_missing_products_asyncpg(monkeypatch):
    # Prepare fake rows where 'howToUse' is empty for one row
    rows = [
        FakeRecord({"id": "1", "title": "P1", "howToUse": ""}),
        FakeRecord({"id": "2", "title": "P2", "howToUse": "Use it"}),
    ]
    conn = FakeConn(rows=rows)
    pool = FakePool(conn)
    monkeypatch.setattr(main, "pool", pool)
    monkeypatch.setattr(main, "prisma", None)

    found = await main.db_find_missing_products(["howToUse"], limit=10)
    # Only the first row has empty howToUse
    assert isinstance(found, list)
    assert any(p["id"] == "1" for p in found)


@pytest.mark.asyncio
async def test_db_fetch_and_update_asyncpg(monkeypatch):
    row = FakeRecord({"id": "10", "title": "Ten", "howToUse": "Do X"})
    conn = FakeConn(row=row)
    pool = FakePool(conn)
    monkeypatch.setattr(main, "pool", pool)
    monkeypatch.setattr(main, "prisma", None)

    fetched = await main.db_fetch_product("10")
    assert fetched["id"] == "10"
    assert fetched["title"] == "Ten"

    # Update: returning updated row
    updated_row = FakeRecord({"id": "10", "title": "Ten", "howToUse": "Updated"})
    conn2 = FakeConn(row=updated_row)
    pool2 = FakePool(conn2)
    monkeypatch.setattr(main, "pool", pool2)

    updated = await main.db_update_product("10", {"howToUse": "Updated"})
    assert updated["howToUse"] == "Updated"
