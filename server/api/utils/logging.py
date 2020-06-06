from datetime import datetime

def get_date():
    date_time = datetime.now()
    date_str = '{}.{}.{}.'.format(date_time.year, date_time.month, date_time.day)
    time_str = '{}:{}:{}'.format(date_time.hour, date_time.minute, date_time.second)
    return (date_str, time_str)


def info(msg):
    date = get_date()
    print('{} {} INFO: {}'.format(date[0], date[1], msg))


def error(msg):
    date = get_date()
    print('{} {} ERROR: {}'.format(date[0], date[1], msg))