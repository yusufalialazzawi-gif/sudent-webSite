import json,glob,sys
base=json.load(open('part2.json',encoding='utf-8'))
idx={e['slug']:e for e in base}
n=0
for fp in glob.glob('work2/ov_*.json'):
    data=json.load(open(fp,encoding='utf-8'))
    if isinstance(data,dict): data=[data]
    for o in data:
        s=o.pop('slug')
        if s in idx:
            idx[s].update(o); n+=1
        else:
            print('UNKNOWN SLUG',s)
json.dump(base,open('part2.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('merged',n)
