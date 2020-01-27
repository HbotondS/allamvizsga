import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer


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
            file_path = subdir + '/' + file
            # print(file_path)
            myjson['images'].append(file_path)

    myjson['size'] = nr_files
    # print(json.dumps(myjson))
    return json.dumps(myjson)


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        if self.path == '/images':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(bytes(getImages(), 'utf-8'))


print("server started...")
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()
