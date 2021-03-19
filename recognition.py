import os
import numpy as np
from PIL import Image, ImageOps
from statistics import mean
import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs
from sklearn.preprocessing import LabelEncoder

""" ---------- PREPARE DATA ---------- """

# datasets to be used in recognition
images = []
labels = []


def makeFinalArr(image_arr):
    new_img_arr = []
    for row_num in range(len(image_arr)):
        inner = []
        for rgb_arr in image_arr[row_num]:
            inner.append(round(mean(rgb_arr)) / 255)  # normalizing the values
        new_img_arr.append(np.array(inner))
    return np.array(new_img_arr)


for filename in os.listdir("baybayin-images"):
    # populate image dataset
    im = ImageOps.invert(Image.open("baybayin-images/" + filename))
    temp_arr = np.array(im)
    final_arr = makeFinalArr(temp_arr)
    images.append(final_arr)

    # populate label dataset
    label = filename.split(".")[0]
    labels.append(label)

# integer and one-hot encode label dataset
label_encoder = LabelEncoder()
labels = keras.utils.to_categorical(label_encoder.fit_transform(labels))

# delineate train and test data with 70/30 split
split = round(len(images) * .7)
train_images = np.array(images[:split])
train_labels = np.array(labels[:split])
test_images = np.array(images[split:])
test_labels = np.array(labels[split:])

# reshape and scale data
train_images = train_images.reshape([-1, 28, 28, 1])
test_images = test_images.reshape([-1, 28, 28, 1])


""" ---------- BUILD MODEL ---------- """

model = keras.Sequential([
    keras.layers.Conv2D(32, (5, 5), padding="same", input_shape=[28, 28, 1]),
    keras.layers.MaxPool2D((2, 2)),
    keras.layers.Conv2D(64, (5, 5), padding="same"),
    keras.layers.MaxPool2D((2, 2)),
    keras.layers.Flatten(),
    keras.layers.Dense(1024, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(63, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_images, train_labels, validation_data=(
    test_images, test_labels), epochs=5)

# test_acc = model.evaluate(test_images, test_labels)
# print('Test accuracy:', test_acc)

# ~0.94 accuracy

""" ---------- SAVE MODEL ---------- """

tfjs.converters.save_keras_model(model, "public/model/")
