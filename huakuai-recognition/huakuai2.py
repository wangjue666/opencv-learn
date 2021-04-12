import cv2
import argparse
# 设置参数
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--input", required=True,
	help="path to input image")
ap.add_argument("-H", "--huakuai", required=True,
	help="path to template huakuai image")
ap.add_argument("-o", "--outputImg", required=False,
	help="path to output image")	
ap.add_argument("-p", "--isPutImg", required=False,
	help="is gen Put Img")		
args = vars(ap.parse_args())

def identify_gap(bg,tp,out, isGen):
 '''
 bg: 背景图片
 tp: 缺口图片
 out:输出图片
 '''
 # 读取背景图片和缺口图片
 bg_img = cv2.imread(bg) # 背景图片
 tp_img = cv2.imread(tp) # 缺口图片
 
 # 识别图片边缘
 bg_edge = cv2.Canny(bg_img, 200, 200)
 tp_edge = cv2.Canny(tp_img, 200, 200, L2gradient = False)
 
 # 转换图片格式
 bg_pic = cv2.cvtColor(bg_edge, cv2.COLOR_GRAY2RGB)
 tp_pic = cv2.cvtColor(tp_edge, cv2.COLOR_GRAY2RGB)
 
 # 缺口匹配
 res = cv2.matchTemplate(bg_pic, tp_pic, cv2.TM_CCOEFF_NORMED)
 min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res) # 寻找最优匹配
 tl = max_loc # 左上角点的坐标
 # 绘制方框
 if isGen == "1":
    th, tw = tp_pic.shape[:2] 
    br = (tl[0]+tw,tl[1]+th) # 右下角点的坐标
    cv2.rectangle(bg_img, tl, br, (0, 0, 255), 2) # 绘制矩形
    cv2.imwrite(out, bg_img) # 保存在本地
 # 返回缺口的X坐标
 return tl[0] 




X = identify_gap(args["input"], args["huakuai"], args["outputImg"], args["isPutImg"])

print(X)