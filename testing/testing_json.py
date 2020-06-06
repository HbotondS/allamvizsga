import json
import time

# open json
with open('images/ImageDataset.TwitterFDL2015.json', encoding="utf8") as f:
    # stripping the newline character
    lines = [line.rstrip() for line in f]

# convert string to json
data = [json.loads(line) for line in lines]
print(data[0]["id_str"])
print(time.gmtime(int(data[0]["timestamp_ms"]) / 1000.).tm_year)