<template>
  <el-row :gutter="5">
    <el-col :xs="12" :sm="12" :md="8" :lg="4"
            v-for="(item,i) in imglist"
            :key="item"
            v-loading="loading[i] !== false"
            element-loading-text="正在拼命加载中..."
            element-loading-svg-view-box="-10, -10, 50, 50"
    >
            <el-card  :body-style="{ padding: '2px' }" >
              <div style="text-align: center;">
                <el-icon size="30px"  color="lightblue" @click="selectStar(i)">
                  <star v-if="!item.star" />
                  <star-filled v-if="item.star" />
                </el-icon>
                <el-icon size="30px" color="lightblue" @click="selectDownload(item.id)" >
                  <Download />
                </el-icon>
              </div>
              <div  class="related_box"  @click="selectItem(item.id)">
                <el-image
                    :src="domainList[Math.floor(Math.random() * (domainList.length))] + '/' + item.prefix + '/' + item.suffix + '/' + item.thumbnail"
                    fit="cover"
                    class="el-image"
                    @load="successLoad(i)"
                    @error="errorLoad(i)"
                >
                </el-image>
                <div>
                  <div style="color: rgb(128,128,128);text-align: left;font-size: 15px" v-if="item.time != null">
                    <span>{{item.time}}</span>
                  </div>

                  <span>{{item.name}}</span>

                </div>
              </div>
            </el-card>

    </el-col>
  </el-row>





</template>

<script>

import { Star, StarFilled} from "@element-plus/icons-vue";
import loadZip from "@/router/loadZip.js";

export default {
  name: 'PhotoCard',
  components: { StarFilled, Star},
  data(){
    return{
      loading:[],
      random:1,
      domainCount:[],
      domainList:["https://yaoyao.dynv6.net","https://yaoyao.dynv6.net","https://heiqunhui.dynv6.net:1223"]
    }
  },
  created() {
    this.random = Math.floor(Math.random() * 100);
    this.domainCount = new Array(48).fill(0);
  },
  methods:{
    selectItem(id){
      this.$emit("selectItem",id)
    },
    clearLoading(){
      this.loading = []
    },
    selectStar(i){
      this.$emit("selectStar",i)
    },
    selectDownload(i){
      this.$emit("selectDownload",i)
    },
    errorLoad(i){
      if (this.domainCount[i]+1 >= this.domainList.length){
        return;
      }
      console.log(this.imglist[i].domain + this.domainCount[i])
      this.imglist[i].domain = this.domainList[this.domainCount[i]]
      console.log(this.imglist[i].domain)
      this.domainCount[i] = this.domainCount[i]+1
      console.log(this.domainCount[i])
    },
    successLoad(i){
      this.loading[i] = false;
      this.domainCount[i] = 0;
    }
  },
  props: {
    imglist: Array,
  }
}

</script>

<style scoped>

.related_box {
  height:548px;
  text-align: center;
  color: skyblue;
}
.el-image {
  height: 85%;
  border-radius: 10px;
}

</style>
