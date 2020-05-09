import numpy as np
import cv2
import timeit
from PIL import Image


start = timeit.default_timer()
row = []
for j in range(200):
    images = []
    for i in range(1, 200):
        images.append(cv2.imread("./images/single-images/40k/" + str(i) + ".jpg"))
    row.append(cv2.hconcat(images))

output = cv2.vconcat(row)
cv2.imwrite('BIG.jpg', output)
cv2.imshow('faszom', output)
cv2.waitKey(0)
cv2.destroyAllWindows()


stop = timeit.default_timer()
print('Time: ', stop - start)