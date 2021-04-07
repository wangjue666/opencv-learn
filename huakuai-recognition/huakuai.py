import cv2


# 读取背景图片和缺口图片
bg_img = cv2.imread('55.png') # 背景图片
tp_img = cv2.imread('hk2.png') # 缺口图片


# 识别图片边缘
bg_edge = cv2.Canny(bg_img, 200, 200)
tp_edge = cv2.Canny(tp_img, 200, 200)

# 将灰度图转换RGB格式
bg_pic = cv2.cvtColor(bg_edge, cv2.COLOR_GRAY2RGB)
tp_pic = cv2.cvtColor(tp_edge, cv2.COLOR_GRAY2RGB)

cv2.imshow('dst',bg_pic) 
cv2.waitKey(0) 

cv2.imshow('dst',tp_pic) 
cv2.waitKey(0) 
# 缺口匹配 在背景图片中搜索对应的缺口
res = cv2.matchTemplate(bg_pic, tp_pic, cv2.TM_CCOEFF_NORMED)

# 选择匹配度最高的点
# 匹配的最小值、匹配的最大值、最小值的位置、最大值的位置
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
print(min_val, max_val, min_loc, max_loc )

# X 即为 横坐标偏移量
X = max_loc[0]

# 绘制方框

# 获取滑块图片的长和宽
th, tw = tp_pic.shape[:2] 

# 左上角点的坐标
tl = max_loc

# 计算右下角点的坐标
br = (tl[0]+tw,tl[1]+th)
cv2.rectangle(bg_img, tl, br, (0, 0, 255), 2) # 绘制矩形
cv2.imwrite('out2.jpg', bg_img) # 保存在本地