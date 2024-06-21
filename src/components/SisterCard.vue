<template>

  <tabs-sister></tabs-sister>
  <el-row :gutter="5">
    <el-col :xs="12" :sm="12" :md="8" :lg="4"
            v-for="(item) in SisterList"
            :key="item"
    >
      <el-card  :body-style="{ padding: '2px' }" >
        <div  class="related_box" >
          <el-scrollbar>
          <div >标题:<span >{{ item.title }}</span></div>
          <div >地区:<span>{{ item.area1Str }}-{{ item.area2Str }}-{{ item.areaDetail }}</span></div>
          <div >年龄:<span>{{ item.age }}</span></div>
          <div >单次价格:<span>{{ item.stPrice }}</span></div>
          <div >包夜价格:<span>{{ item.ltPrice }}</span></div>
          <div >服务项目:<span>{{ item.services }}</span></div>
          <div>联系方式</div>
          <div >qq:<span>{{ item.qq }}</span></div>
          <div >微信:<span>{{ item.wechat }}</span></div>
          <div >电话:<span>{{ item.tel }}</span></div>
          <div >描述:<span>{{ item.detail }}</span></div>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import { Star, StarFilled} from "@element-plus/icons-vue";
import axios from "axios";
import PhotoCard from "@/components/PhotoCard.vue";
import TabsSister from "@/components/TabsSister.vue";
export default {
  components: { PhotoCard, StarFilled, Star,TabsSister},
  data(){
    return{
      SisterList:[],
    }
  },
  created() {
    axios.get('/src/assets/w.json').then((res) => {
      this.SisterList = res.data
    })

  },
  methods:{

  },
  props: {

  }
}

</script>

<style scoped>

.related_box {
  height: 518px;
  font-size: 14px;
}
.related_box div{
  font-weight: 700;
}
.related_box span{
  font-weight: 400;
}
</style>