import os, json


def getImages():
    rootdir = 'C:/Users/Boti/Desktop/python server testing/server/test-directory'

    myjson = {
        'size': 0,
        'images': []
    }

    nr_files = 0
    for subdir, dirs, files in os.walk(rootdir):
        # print(files)
        for file in files:
            nr_files += 1
            file_name = file[:-4]
            file_path = subdir + '/' + file
            # print(file_path)
            myjson['images'].append(file_path)

    myjson['size'] = nr_files
    # print(json.dumps(myjson))
    return json.dumps(myjson)


def readJson():
    file = 'C:/Users/Boti/Desktop/python server testing/server/test.json'
    data = []

    with open(file) as f:
        lines = f.readlines()
        for line in lines:
            data.append(json.loads(line))

        for k in data:
            print(k['_id'])




readJson()