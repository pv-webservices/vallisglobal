from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
for name in ['browser-matrix','browser-interactions','browser-accessibility','browser-progressive']:
    f=root/'output'/f'{name}.log'
    if f.exists():
        match=re.search(r'### Result\s*\n(.*?)\n### Ran Playwright code',f.read_text(encoding='utf-8'),re.S)
        if match:
            report=json.loads(match.group(1))
            (root/'output'/f'{name}.json').write_text(json.dumps(report,indent=2))
            print(name,report.get('status'))
