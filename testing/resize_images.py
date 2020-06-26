import os
import cv2

counter = 0

folder = 'images'
for filename in os.listdir(folder + '/Twitter_2016_Imgs'):
    try:
        img = cv2.imread(folder + '/Twitter_2016_Imgs/' + filename, cv2.IMREAD_UNCHANGED)
    
        dim = (25, 25)
        resized = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)

        cv2.imwrite(folder + '/twitter-2016/' + filename, resized)
        # counter += 1
        # if (counter <= 1000):
        #     cv2.imwrite(folder + '/twitter-small/1k/' + filename, resized)
        # if (counter <= 10000):
        #     cv2.imwrite(folder + '/twitter-small/10k/' + filename, resized)
        # if (counter <= 20000):
        #     cv2.imwrite(folder + '/twitter-small/20k/' + filename, resized)
        # if (counter <= 40000):
        #     cv2.imwrite(folder + '/twitter-small/40k/' + filename, resized)
    except Exception as e:
        print('{} hiba tortent a keppel'.format(filename))
