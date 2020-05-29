import json

with open('images/ImageDataset.TwitterFDL2015.json', encoding="utf8") as f:
    lines = [line.rstrip() for line in f]

data = [json.loads(line) for line in lines]
print(data[0]["id_str"])