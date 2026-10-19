"""Execute our trusted, authored Python templates; never runs user-entered code."""
import copy
import json
from pathlib import Path
lessons = json.loads((Path(__file__).parent.parent / 'src/data/lessons.json').read_text())
count = 0
for lesson in lessons:
    namespace = {}
    exec(compile(lesson['code'], lesson['id'], 'exec'), namespace)
    for case in lesson['cases']:
        actual = namespace['solve'](*copy.deepcopy(case['args']))
        assert actual == case['expected'], (lesson['id'], case, actual)
        count += 1
print(f'{count} Python example checks passed across {len(lessons)} lessons.')
