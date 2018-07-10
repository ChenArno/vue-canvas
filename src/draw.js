import store from './Store'

class Draw {
  constructor(el, width, height) {
    this.el = el;
    this.width = width;
    this.height = height;
    this.type = "move";
    this.isDraw = false;
    this.canvas = document.getElementById(this.el);
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = "#FF0000";
    this.context.fillStyle = "#FF0000";
    this.context.font = "18px Arial";
    this.img = new Image(); //用于动态绘制指向，矩形，原型
    this.rects = [];
    this.init();
  }

  init() {
    this.canvas.addEventListener('mousedown', event => {
      this.isDraw = true;
      this.originX = event.offsetX - this.canvas.offsetLeft; //原点x坐标
      this.originY = event.offsetY - this.canvas.offsetTop; //原点y坐标
      this.context.moveTo(this.originX, this.originY);
      if (this.type == "move") {
        this.canvasClick(event);
      }
    }, false)
    this.canvas.addEventListener('mousemove', event => {
      if (this.isDraw) {
        let x = event.offsetX - this.canvas.offsetLeft;
        let y = event.offsetY - this.canvas.offsetTop;
        let newOriginX = this.originX,
          newOriginY = this.originY;
        if (this.SelectedRect && this.type == "move") {
          if (this.isDragging) {
            this.rects.forEach((v, i, a) => {
              if (this.SelectedRect == v) {
                v.x = x - this.x1;
                v.y = y - this.y1;
                this.SelectedRect = v;
              }
              a[i] = v;
            })
          }
          if (this.isRight) {
            this.rects.forEach((v, i, a) => {
              if (this.SelectedRect == v) {
                //设置拉伸最小的边界
                if ((x - this.SelectedRect.x) > 50) {
                  this.SelectedRect.w = event.offsetX - this.canvas.offsetLeft - this.SelectedRect.x;
                } else {
                  this.SelectedRect.w = 50;
                }
                if ((y - this.SelectedRect.y) > 50) {
                  this.SelectedRect.h = event.offsetY - this.canvas.offsetTop - this.SelectedRect.y;
                } else {
                  this.SelectedRect.h = 50;
                }
                this.SelectedRect = v;
              }
              a[i] = v;
            })
          }

          this.drawRect();
        } else if (this.type == "rect") {
          this.drawRect();

          if (x < this.originX) {
            newOriginX = x;
          }
          if (y < this.originY) {
            newOriginY = y;
          }
          let w = Math.abs(x - this.originX);
          let h = Math.abs(y - this.originY);
          this.context.lineWidth = 3;
          this.context.strokeRect(newOriginX, newOriginY, w, h);
          if (w > 50 && h > 50) {
            this.SelectedRect = {
              x: newOriginX,
              y: newOriginY,
              w,
              h,
              isSelected: true
            }
          } else {
            this.SelectedRect = null;
          }
          this.context.stroke();
          this.context.closePath();
        }
      }

    }, false)
    this.canvas.addEventListener('mouseleave', event => {
      if (this.isDraw) {
        this.isDraw = false;
        this.context.closePath();
      }
    }, false)
    this.canvas.addEventListener('mouseup', event => {
      this.isDraw = false;
      if (this.type == "move") {
        this.isDragging = false;
        this.isRight = false;
      } else if (this.type == "rect") {
        if (this.SelectedRect) {
          this.rects = [...this.rects, ...[this.SelectedRect]];
        }
        // this.type = "move";
        store.commit('SET_USETYPE', 'move');
      }
    }, false)
  }
  changeType(type) {
    this.type = type;
  }

  drawImage(src) {
    this.img.src = src;
    this.img.onload = () => {
      this.context.drawImage(this.img, 0, 0);
    }
  }

  setRects(list) {
    this.rects = list;
  }

  canvasClick(e) {
    // 取得画布上被单击的点
    this.originX = e.offsetX - this.canvas.offsetLeft;
    this.originY = e.offsetY - this.canvas.offsetTop;
    let widthstart, widthend, heightstart, heightend;
    // 查找被单击的矩形框
    this.rects.forEach((v, i, a) => {
      widthstart = v.x;
      widthend = v.x + v.w;
      heightstart = v.y;
      heightend = v.y + v.h;
      // 判断这个点是否在矩形框中 线长1*2
      if ((this.originX >= widthstart && this.originX < (widthend - 2)) && (this.originY >= heightstart) && (this.originY < (heightend - 2))) {
        // 清除之前选择的矩形框
        if (this.SelectedRect != null) this.SelectedRect.isSelected = false;
        this.SelectedRect = v;
        this.x1 = this.originX - this.SelectedRect.x;
        this.y1 = this.originY - this.SelectedRect.y;
        //选择新圆圈
        v.isSelected = true;
        // console.log(this.SelectedRect);
        /*
          设置拉伸的界限。右下角40 * 40
          */
        if (this.originX >= (widthend - 20) && this.originX <= widthend && this.originY >= (heightend - 20) && this.originY <= heightend) {
          this.isRight = true;
        } else {
          // 使圆圈允许拖拽
          this.isDragging = true;
        }

        //更新显示
        this.drawRect();
        a[i] = v;
        //停止搜索
        return;
      }
    })
  }

  drawRect() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(this.img, 0, 0);
    this.context.beginPath();
    this.rects.map(v => {
      if (this.SelectedRect != v) {
        v.isSelected = false;
      }
      this.context.lineWidth = v.isSelected ? 3 : 1;
      this.context.strokeRect(v.x, v.y, v.w, v.h);
      this.context.fillRect(v.x + v.w - 20, v.y + v.h - 20, 20, 20);
      v.label && this.context.fillText(v.label, v.x + v.w / 2 - v.label.length * 9, v.y + v.h / 2 - 9);
    })
  }

  setFont({
    label,
    id
  }) {
    this.SelectedRect.label = label;
    this.SelectedRect.id = id;
    this.drawRect();
  }
}

export default Draw
