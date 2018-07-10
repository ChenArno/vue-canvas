<template>
  <div class="canvas">
    <canvas id="myCanvas" width="640" height="480">
      您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    <ul class="menu">
      <li :class="[type == item.type?'active':'']" v-for="item in typeList" :key="item.type" @click="change(item)">{{item.name}}</li>
      <li class="menuLi" v-if="isShowList" v-for="i in menuList" :key="i.id" @click="onclick(i)">{{i.label}}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Draw from '../draw'

export default {
  props: ['src'],
  name: 'canvas-vue',
  data() {
    return {
      myCanvas: null,
      pen: null,
      type: 'move',
      typeList: [
        {
          type: 'move',
          name: '移动'
        },
        {
          type: 'rect',
          name: '矩形'
        }
      ],
      menuList:[{
        id:1,
        label:"搜索"
      },{
        id:2,
        label:"发"
      },{
        id:3,
        label:"规范化"
      },{
        id:4,
        label:" 的风格"
      },{
        id:5,
        label:"地方"
      }],
      isShowList:false
    }
  },
  mounted() {
    this.myCanvas = new Draw('myCanvas',640,480)
    this.myCanvas.drawImage(this.src)
  },
  watch:{
    type(val){
      this.myCanvas.changeType(val)
    },
    useType(val,old){
      if(val == "move" && old == "rect"){
        this.isShowList = true;
      }
      this.type = val
    }
  },
  computed:{
    ...mapGetters(['useType'])
  },
  methods:{
    change({type}){
      this.type = type;
      this.$store.commit('SET_USETYPE',type);
    },
    onclick(val){
      this.myCanvas.setFont(val);
      this.isShowList = false;
    }
  }
}
</script>

<style scoped>
#myCanvas {
  float: left;
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
}
.menu {
  float: left;
  list-style-type: none;
  width: 100px;
  border: 1px solid #ccc;
  height: 480px;
  margin: 0 30px 0;
  padding: 0;
  background-color: #ccc;
}
.menu li {
  float: left;
  width: 44px;
  height: 44px;
  line-height: 44px;
  cursor: pointer;
  border: 3px solid #ccc;
}
.menu li.menuLi{
  width: 94px;
}
.menu li.active {
  background-color: #fff;
}
</style>
