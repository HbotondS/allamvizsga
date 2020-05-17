import numpy as np
import cv2
import timeit
from PIL import Image
import os
from math import sqrt, ceil


def big():
    start = timeit.default_timer()
    row = []
    folder = 'images/twitter-small/40k/'
    file_list = os.listdir(folder)
    imglist_len = len(file_list)
    row_length = ceil(sqrt(imglist_len))
    print('dimension: {}'.format(row_length))
    index = 0
    for j in range(row_length):
        images = []
        for i in range(1, row_length):
            if index < imglist_len:
                images.append(cv2.imread(folder + file_list[index]))
                index += 1
            else:
                break

        row.append(cv2.hconcat(images))

    blank = np.zeros(shape=[50, row[0].shape[1] - row[len(row)-1].shape[1], 3], dtype=np.uint8)
    row[len(row)-1] = cv2.hconcat([row[len(row)-1], blank])
    output = cv2.vconcat(row)
    cv2.imwrite('BIG.jpg', output)

    stop = timeit.default_timer()
    print('Time: ', stop - start)


def resize(folder, filename):
    img = cv2.imread(folder + '/1k/' + filename, cv2.IMREAD_UNCHANGED)

    # print('Original Dimensions : ', img.shape)
    dim = (25, 25)
    # resize image
    resized = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
    
    # print('Resized Dimensions : ', resized.shape)
    cv2.imwrite(folder + '/small/' + filename, resized)


def list_files():
    folder = 'images/testing'
    for filename in os.listdir(folder + '/1k'):
        # print(filename)
        resize(folder, filename)


def testing_concat():
    img1 = cv2.imread('images/single-images/1k/1.jpg')
    img2 = cv2.imread('images/single-images/1k/2.jpg')
    hor = cv2.hconcat([img1, img2])
    print(hor.shape)
    img3 = cv2.imread('images/single-images/1k/3.jpg')
    
    blank = np.zeros(shape=[50, hor.shape[1] - img3.shape[1], 3], dtype=np.uint8)
    hor2 = cv2.hconcat([img3, blank])
    print(hor2.shape)
    
    ver = cv2.vconcat([hor, hor2])
    cv2.imshow('test', ver)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# resize()
# list_files()
big()