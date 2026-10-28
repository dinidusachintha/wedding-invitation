import urllib.request
import urllib.error

try:
    with urllib.request.urlopen("http://localhost:3000") as resp:
        print("Status:", resp.status)
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    body = e.read().decode('utf-8', errors='ignore')
    print("Body length:", len(body))
    # print relevant snippet
    import re
    errors = re.findall(r'<pre[^>]*>(.*?)</pre>', body, re.DOTALL)
    if errors:
        for err in errors:
            print("ERROR SNIPPET:", err[:1000])
    else:
        print(body[:2000])
except Exception as e:
    print("Error:", e)
