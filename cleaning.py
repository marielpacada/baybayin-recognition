# import tensorflow as tf
# from statistics import mean
# from matplotlib import pyplot as plot
import numpy as np
import os
# from PIL import Image, ImageOps

for filename in os.listdir("baybayin-images"):
    print(filename)



# im = Image.open("baybayin-images/a.0JWo-James.jpg")
# im_arr = np.array(im)
#
# inv = ImageOps.invert(im)
# inv_arr = np.array(inv)

# new_arr = []
# for row in range(len(inv_arr)):
#     new_row = []
#     for pixel in inv_arr[row]:
#         new_row.append(round(mean(pixel)))
#     new_arr.append(new_row)
