import numpy as np
import cv2
import timeit
from PIL import Image
import os


def big():
    start = timeit.default_timer()
    row = []
    for j in range(200):
        images = []
        for i in range(1, 200):
            images.append(cv2.imread("./images/single-images/40k/" + str(i) + ".jpg"))
        row.append(cv2.hconcat(images))

    output = cv2.vconcat(row)
    cv2.imwrite('BIG.jpg', output)
    cv2.imshow('test', output)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

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


# resize()
list_files()