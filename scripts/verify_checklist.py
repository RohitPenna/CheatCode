"""Read-only check against NeetCode's metadata; never overwrites local content."""
import argparse
import json
from pathlib import Path
from urllib.request import urlopen

parser = argparse.ArgumentParser()
parser.add_argument('--file', help='Use a previously downloaded official metadata snapshot')
args = parser.parse_args()
url = 'https://raw.githubusercontent.com/neetcode-gh/leetcode/main/.problemSiteData.json'
if args.file:
    raw = json.loads(Path(args.file).read_text())
else:
    with urlopen(url, timeout=30) as response:
        raw = json.load(response)
upstream = {p['link'].rstrip('/'): p for p in raw if p.get('neetcode150')}
root = Path(__file__).resolve().parent.parent
local = {p['id']: p for p in json.loads((root / 'src/data/problems.json').read_text())}
assert len(upstream) == 150, f'Upstream count changed: {len(upstream)}'
assert set(upstream) == set(local), {'missing': sorted(set(upstream)-set(local)), 'extra': sorted(set(local)-set(upstream))}
# Verified against the current official website on 2026-10-18.
category_overrides = {'generate-parentheses': 'Backtracking'}
for key, problem in local.items():
    source = upstream[key]
    assert problem['difficulty'] == source['difficulty'], (key, 'difficulty changed')
    assert problem['category'] == category_overrides.get(key, source['pattern']), (key, 'category changed')
print('Verified all 150 identities, difficulties, and categories (one documented website override).')
