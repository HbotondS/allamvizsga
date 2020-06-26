import numpy
from PIL import Image

for n in range(100000):
    a = numpy.random.rand(30, 30, 3) * 255
    im_out = Image.fromarray(a.astype('uint8')).convert('RGB')
    im_out.save('images/billionsandbillions/out{}.jpg'.format(n))

print("i'm done")