from django.http import HttpResponse
from django.core import serializers
from math import sqrt
from random import shuffle
from ..utils import util
import threading
import json
import cv2


class Image_Collection:
    def __init__(self, image_datas):
        self.image_datas = image_datas

    def __multithread_imggen(self, big_img, row_index, index, row_length):
        images = []
        imglist_len = len(self.image_datas)
        for i in range(1, row_length):
            if index < imglist_len:
                images.append(cv2.imread(self.image_datas[index].index))
                index += 1
            else:
                break

        big_img[row_index] = (cv2.hconcat(images))


    def grid(self):
        imglist_len = len(self.image_datas)
        # calculate how many image can fit in a row
        # to display the images in a square
        row_len = util.round(sqrt(imglist_len))

        big_img = {}
        index = 0
        # creating thread 
        threads = []
        for i in range(row_len-1):
            threads.append(threading.Thread(target=self.__multithread_imggen, args=(big_img, i, i*row_len, row_len)))

        for i in range(row_len-1):
            threads[i].start()

        for i in range(row_len-1):
            # waiting the threads to finish
            threads[i].join()

        self.__multithread_imggen(big_img, row_len-1, (row_len-1) * row_len, row_len)

        blank = util.blank_image(shape=[50, big_img[0].shape[1] - big_img[row_len-1].shape[1], 3])
        big_img[row_len-1] = cv2.hconcat([big_img[row_len-1], blank])

        big = []
        for item in sorted(big_img.items()):
            big.append(item[1])

        output = cv2.vconcat(big)
        cv2.imwrite('media/big.jpg', output)


    def reverse(self):
        self.image_datas = self.image_datas[::-1]


    def shuffle(self):
        print(self.image_datas[0])
        shuffle(self.image_datas)
        print(self.image_datas[0])


    def get_grid_data(self):
        data = serializers.serialize('json', self.image_datas)
        return HttpResponse(data, content_type='application/json')


    def get_histogram_data(self):
        data = json.dumps(self.hist_datas)
        return HttpResponse(data, content_type='application/json')


    def data2dict(self, img_data):
        img_data_dict = {}
        img_data_dict['id'] = img_data._id
        img_data_dict['tweet'] = img_data.tweet_text
        img_data_dict['index'] = img_data.index
        img_data_dict['image'] = img_data.image

        return img_data_dict


    def gen_dict(self, sort):
        img_dict = {}
        self.hist_datas = {}
        for img_data in self.image_datas:
            if img_data.date in img_dict:
                if sort == '':
                    img_dict[img_data.date].append(img_data.index)
                    self.hist_datas[str(img_data.date)].append(self.data2dict(img_data))
                elif sort == 'month':
                    img_dict[img_data.date.month].append(img_data.index)
                    self.hist_datas[str(img_data.date.month)].append(img_data)
                elif sort == 'day':
                    img_dict[img_data.date.day].append(img_data.index)
                    self.hist_datas[str(img_data.date.day)].append(img_data)
            else:
                if sort == '':
                    img_dict[img_data.date] = [img_data.index]
                    self.hist_datas[str(img_data.date)] = [self.data2dict(img_data)]
                elif sort == 'month':
                    img_dict[img_data.date.month] = [img_data.index]
                    self.hist_datas[str(img_data.date.month)] = [img_data]
                elif sort == 'day':
                    img_dict[img_data.date.day] = [img_data.index]
                    self.hist_datas[str(img_data.date.day)] = [img_data]

        return img_dict


    # return the length of the longest element from the dictionary
    def __get_max_flow(self, hist_dict):        
        pos = max(hist_dict, key=lambda k: len(hist_dict[k]))
        return len(hist_dict[pos])

    
    def histogram(self, sort):
        hist_dict = self.gen_dict(sort)

        height = self.__get_max_flow(hist_dict)
        big_img = []
        x_offset = 0
        for i in hist_dict:
            y_offset = 0
            column_img = util.blank_image(shape=[height * 50, 50, 3])
            for img_path in hist_dict[i]:
                img = cv2.imread(img_path)
                column_img[column_img.shape[0]-(y_offset+1)*img.shape[0] : column_img.shape[0] - y_offset * img.shape[0],
                            0:column_img.shape[1]] = img
                y_offset += 1

            big_img.append(column_img)

        output = cv2.hconcat(big_img)
        cv2.imwrite('media/hist.jpg', output)