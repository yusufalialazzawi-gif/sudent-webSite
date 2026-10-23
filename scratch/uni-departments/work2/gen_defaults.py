import json
entries=[]
with open('chunk-2.txt',encoding='utf-8') as f:
    for line in f:
        line=line.strip()
        if not line: continue
        parts=[p.strip() for p in line.split('|')]
        slug,nameTr,nameEn,kind,city=parts[0],parts[1],parts[2],parts[3],parts[4]
        entries.append({"slug":slug,"nameTr":nameTr,"facultyCount":None,"departmentCount":None,"departmentCountBasis":"UNVERIFIED","bestDepartments":[],"sourceUrl":"","asOf":"2026-10-22","confidence":"low"})
json.dump(entries,open('part2.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(entries))
