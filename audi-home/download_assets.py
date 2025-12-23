"""
Helper script to download assets listed in `metadata.json` into the local `assets/` folders.
Run: python download_assets.py
"""

import os
import json
import urllib.parse

import requests

ROOT = os.path.dirname(__file__)
META = os.path.join(ROOT, 'metadata.json')

with open(META, 'r', encoding='utf-8') as f:
    meta = json.load(f)

assets = meta.get('assets', [])

os.makedirs(os.path.join(ROOT, 'assets', 'images'), exist_ok=True)
os.makedirs(os.path.join(ROOT, 'assets', 'icons'), exist_ok=True)
os.makedirs(os.path.join(ROOT, 'assets', 'logos'), exist_ok=True)
os.makedirs(os.path.join(ROOT, 'assets', 'fonts'), exist_ok=True)

for a in assets:
    url = a['url']
    filename = a.get('filename') or os.path.basename(urllib.parse.urlparse(url).path)
    # sanitize filename
    filename = urllib.parse.unquote(filename).split('?')[0]

    if a['type'] == 'font':
        outdir = os.path.join(ROOT, 'assets', 'fonts')
    elif a['type'] in ('icon', 'logo'):
        outdir = os.path.join(ROOT, 'assets', 'logos')
    else:
        outdir = os.path.join(ROOT, 'assets', 'images')

    outfile = os.path.join(outdir, filename)
    if os.path.exists(outfile):
        print(f"Exists: {outfile}")
        continue

    try:
        print(f"Downloading {url} -> {outfile}")
        r = requests.get(url, stream=True, timeout=30)
        r.raise_for_status()
        with open(outfile, 'wb') as fh:
            for chunk in r.iter_content(8192):
                if chunk:
                    fh.write(chunk)
    except Exception as e:
        print(f"Failed to download {url}: {e}")

print("Done. Check assets/ for downloaded files.")