import sqlite3, os

for db_path in ["data/wedding.db", "wedding.db"]:
    if os.path.exists(db_path):
        con = sqlite3.connect(db_path)
        cur = con.cursor()
        try:
            rows = cur.execute("SELECT id, name, token, seats, status FROM guests").fetchall()
            print(f"DB {db_path}: {len(rows)} guests")
            for r in rows[:5]:
                print(" ", r)
        except Exception as e:
            print(f"DB {db_path} error: {e}")
