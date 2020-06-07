from math import ceil, sqrt
from random import shuffle
from ..utils import util
import threading
import cv2


class Grid:
    def __init__(self, image_datas):
        self.image_datas = image_datas

    def __multithread_imggen(self, big_img, index, row_length, imglist_len):
        images = []
        for i in range(1, row_length):
            if index < imglist_len:
                images.append(cv2.imread(self.image_datas[index].index))
                index += 1
            else:
                break

        big_img.append(cv2.hconcat(images))


    def gen_img(self):
        imglist_len = len(self.image_datas)
        # calculate how many image can fit in a row
        # to display the images in a square
        row_len = ceil(sqrt(imglist_len))

        big_img = []
        index = 0
        # creating thread 
        threads = []
        for i in range(row_len-1):
            threads.append(threading.Thread(target=self.__multithread_imggen, args=(big_img, i*row_len, row_len, imglist_len)))

        for i in range(row_len-1):
            threads[i].start()

        for i in range(row_len-1):
            # waiting the threads to finish
            threads[i].join()

        self.__multithread_imggen(big_img, (row_len-1) * row_len, row_len, imglist_len)

        blank = util.blank_image(shape=[50, big_img[0].shape[1] - big_img[row_len-1].shape[1], 3])
        big_img[row_len-1] = cv2.hconcat([big_img[row_len-1], blank])
        output = cv2.vconcat(big_img)
        cv2.imwrite('media/big.jpg', output)


    def reverse(self):
        self.image_datas = self.image_datas[::-1]


    def shuffle(self):
        print(self.image_datas[0])
        shuffle(self.image_datas)
        print(self.image_datas[0])