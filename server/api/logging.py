from datetime import datetime


def log_info(msg):
    date_time = datetime.now()
    date_str = '{}.{}.{}.'.format(date_time.year, date_time.month, date_time.day)
    time_str = '{}:{}:{}'.format(date_time.hour, date_time.minute, date_time.second)
    print('{} {} INFO: {}'.format(date_str, time_str, msg))