import sqlite3

try:
    conn = sqlite3.connect('drone.sqlite')
    print(conn.execute("UPDATE repos SET repo_clone_url='http://gogs:3000/geison-melo/projeto-n3.git'").rowcount, "rows updated")
    conn.commit()
    conn.close()
    print("Done")
except Exception as e:
    print(e)
