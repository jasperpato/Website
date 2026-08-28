from util import *
import psycopg2


if __name__ == '__main__':
    conn = psycopg2.connect(
        database=ENV["DB_NAME"],
        user=ENV["DB_USER"],
        password=ENV["DB_PASSWORD"],
        host=ENV["DB_HOST"],
        port=ENV["DB_PORT"],
    )
    conn.autocommit = True

    with conn.cursor() as cur:
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
        tables = [row[0] for row in cur.fetchall()]

        if not tables:
            print("No tables found.")
        else:
            for table in tables:
                cur.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE')
                print(f"Dropped {table}")

    conn.close()
