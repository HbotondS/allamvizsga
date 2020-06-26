import threading
import numpy as np
import cv2
import os
from math import sqrt, ceil
import timeit

matrix = np.zeros((3, 3), dtype=int)

def in_thread(num):
    for i in range(3):
        matrix[num][i] = num
    print('{}. thread done'.format(num))


def multithread_imggen(row, index, row_length):
    images = []
    for i in range(1, row_length):
        if index < imglist_len:
            images.append(cv2.imread(folder + file_list[index]))
            index += 1
        else:
            # print('break')
            return

    row.append(cv2.hconcat(images))


if __name__ == "__main__": 
    start = timeit.default_timer()
    folder = 'images/twitter-2016/'
    file_list = os.listdir(folder)
    imglist_len = len(file_list)
    row_length = ceil(sqrt(imglist_len))
    row = []

    # creating thread 
    threads = []
    for i in range(row_length-1):
        threads.append(threading.Thread(target=multithread_imggen, args=(row, i*row_length, row_length,)))

    print('before')
    for i in range(row_length-1):
        threads[i].start()

    for i in range(row_length-1):
        threads[i].join()

    # multithread_imggen(row, (row_length-1) * row_length, row_length)

    # blank = np.zeros(shape=[50, row[0].shape[1] - row[len(row)-1].shape[1], 3], dtype=np.uint8)
    # row[len(row)-1] = cv2.hconcat([row[len(row)-1], blank])
    output = cv2.vconcat(row)
    cv2.imwrite('BIG.jpg', output)

    print('done')

    stop = timeit.default_timer()
    print('Load time: {0:.3}s'.format(stop - start))