from django.utils.timezone import make_aware
from datetime import datetime
import time
import json
import timeit
import numpy as np

def get_time():
    return timeit.default_timer()


def blank_image(shape):
    return np.zeros(shape=shape, dtype=np.uint8)


def convert_timestamp2date(timestamp):
    gmtime = time.gmtime(int(timestamp) / 1000.)
    date = datetime(gmtime.tm_year, gmtime.tm_mon, gmtime.tm_mday, gmtime.tm_hour, gmtime.tm_min, gmtime.tm_sec)
    return make_aware(date)


def process_json(file_name):
    # open json
    with open(file_name, encoding="utf8") as f:
        # stripping the newline character
        lines = [line.rstrip() for line in f]

    # convert string to json
    # id will be the root node
    data = {}
    for line in lines:
        line_data = json.loads(line)
        data[str(line_data['id_str'])] = line_data

    return data