import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import re


def getImages():
    rootdir = 'C:/Users/Boti/Desktop/allamvizsga/server/test-directory'

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
    return json.dumps(myjson)


def readJson():
    file = 'C:/Users/Boti/Desktop/allamvizsga/server/test.json'
    data = []

    with open(file) as f:
        lines = f.readlines()
        for line in lines:
            data.append(json.loads(line))

        for k in data:
            print(k['_id'])


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        regex = r"\/image\/.+\b"
        print(self.path)
        print(re.match(regex, self.path, re.MULTILINE))
        if self.path == '/images':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Origin', 'localhost')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(bytes(getImages(), 'utf-8'))
        elif re.match(regex, self.path, re.MULTILINE):
            self.send_response(200)
            self.send_header('Content-type', 'image/jpeg')
            self.send_header('Origin', 'localhost')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            file = 'C:/Users/Boti/Desktop/allamvizsga/server/test-directory/1.jpg'
            f = open(file, 'rb')
            fr = f.read(1024)
            self.wfile.write(fr)


print("server started...")
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()
