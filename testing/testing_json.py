import json
import time

# open json
with open('images/ImageDataset.TwitterFDL2015.json', encoding="utf8") as f:
    # stripping the newline character
    lines = [line.rstrip() for line in f]

# convert string to json
# id will be the root node
data = {}
for line in lines:
    line_data = json.loads(line)
    data[str(line_data['id_str'])] = line_data

print(data['673849510750257152']['id_str'])
# convert epoch timestamp into gmtime
print(time.gmtime(int(data['673849510750257152']['timestamp_ms']) / 1000.).tm_year)