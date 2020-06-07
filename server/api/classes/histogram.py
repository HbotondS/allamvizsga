from ..utils import util
import cv2


class Histogram:
    img_dict = {}


    def __init__(self, image_datas):
        for img_data in image_datas:
            if img_data.date in self.img_dict:
                self.img_dict[img_data.date].append(img_data.index)
            else:
                self.img_dict[img_data.date] = [img_data.index]


    # return the length of the longest element from the dictionary
    def __GetMaxFlow(self):        
        pos=max(self.img_dict, key=lambda k: len(self.img_dict[k]))
        return len(self.img_dict[pos])

    
    def gen_img(self):
        height = self.__GetMaxFlow()
        big_img = []
        x_offset = 0
        for i in self.img_dict:
            y_offset = 0
            column_img = util.blank_image(shape=[height * 50, 50, 3])
            for img_path in self.img_dict[i]:
                img = cv2.imread(img_path)
                column_img[column_img.shape[0]-(y_offset+1)*img.shape[0] : column_img.shape[0] - y_offset * img.shape[0],
                            0:column_img.shape[1]] = img
                y_offset += 1

            big_img.append(column_img)

        output = cv2.hconcat(big_img)
        cv2.imwrite('media/hist.jpg', output)