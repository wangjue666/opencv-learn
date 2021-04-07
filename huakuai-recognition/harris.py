#### cv2.cornerHarris()  角点检测
# - img： 数据类型为 ﬂoat32 的入图像
# - blockSize： 角点检测中指定区域的大小
# - ksize： Sobel求导中使用的窗口大小 
# - k： 取值参数为 [0,04,0.06]

import cv2 
import numpy as np

img = cv2.imread('chessboard.jpg')
print ('img.shape:',img.shape)

# 转换成灰度图
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# gray = np.float32(gray)
dst = cv2.cornerHarris(gray, 20, 3, 0.04)
print ('dst.shape:',dst.shape)

# 如果 自相似程度 大于最高点的0.01 就标注成红色
img[dst>0.01*dst.max()]=[0,0,255]
cv2.imshow('dst',img) 
cv2.waitKey(0) 
cv2.destroyAllWindows()