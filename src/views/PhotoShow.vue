<template>
  <div :class="isDark ? 'darks':''" >
      <div class="fixed-header"><h3>{{nameS}}</h3></div>
    <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
<div class="container">

    <el-row :gutter="10" >
      <el-col :xs="24"
              v-for="(item,i) in loadList"
              :key="item"
              v-loading="loading[i] !== false"
              element-loading-text="正在拼命加载中..."
              element-loading-svg-view-box="-10, -10, 50, 50"
      >
        <el-empty :hidden="loading[i] === false" :image="imgList[0]" image-size="300">
        </el-empty>

        <div class="related_box">
          <el-image
              :src="item"
              fit="cover"
              :preview-src-list="loadList"
              class="el-image"
              @load="loading[i] = false"
              :initial-index="i"
              @error="errorLoad(i)"
              lazy
          >
          </el-image>
        </div>

      </el-col>
    </el-row>

</div>
    </ul>
</div>

</template>

<script>
import axios from "axios";
export default {
  name: "PhotoShow",
  data(){
    return{
      loading:[],
      nameS: "",
      domain:"",
      prefix: "",
      suffix: "",
      collection:[],
      imgList:[],
      isDark:false,
      items:[],
      domainCount:[],
      domainList:["https://yaoyao.dynv6.net","https://yaoyao.dynv6.net","https://yaoyao.dynv6.net"],
      loadList:[],
      loadCount:0,
    }
  },
  created() {
    let item = localStorage.getItem("isDark");
    this.isDark = (item === "0");
    const html = document.querySelector('html')
    if (html) {
      if (this.isDark) {
        html.classList.remove("light");
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
        html.classList.add("light");
      }
    }
    this.mount(this.id);
  },
  methods:{
    mount(id){
      // let res = localStorage.getItem("photo_" + id);
      this.$getValue("photo_" + id).then(res => {
        if (res == null){
          axios.get(`${this.$domainUrl}/photo/` + id).then(e => {
            if (e.data.code === 200){
              let date = JSON.stringify(e.data.data);
              this.$setValue("photo_" + id,date)
              this.loadimg(date)
            }
          }).catch(error => {
                console.log("error" + error)
              }
          )
        }else {
          this.loadimg(res)
        }
      })
    },
    loadimg(res){
      let resf = JSON.parse(res);
      this.nameS = resf.name;
      this.prefix = resf.prefix;
      this.suffix = resf.suffix;
      this.domain = resf.domain;
      let parse = JSON.parse(resf.collection);
      this.items = parse;
      this.domainCount = new Array(parse.length).fill(0);
      parse.forEach(item => {
        this.imgList.push(this.domain + "/" + this.prefix + "/" + this.suffix + '/' + item)
      })

      for (let i = 0; i < this.imgList.length; i++) {
        if (i >= 5){
         return
        }
        this.loadList[i] = this.imgList[i];
        this.loadCount = i;
      }
    },
    errorLoad(i){
      if (this.domainCount[i] >= this.domainList.length){
        return;
      }
      this.imgList[i] = this.domainList[this.domainCount[i]] + "/" + this.prefix + "/" + this.suffix + '/' + this.items[i]
      this.domainCount[i] = this.domainCount[i]+1
    },
    // 滑动到底部加载更多图片
    load(){
      if (this.loading[this.loadCount] !== false){
        console.log(this.loading[this.loadCount])
        return;
      }
      this.loadCount += 1;
      if (this.loadCount > this.imgList.length){
        console.log("到底了" + this.loadCount);
        return;
      }
      this.loadList.push(this.imgList[this.loadCount]);

      this.loadCount += 1;
      if (this.loadCount > this.imgList.length){
        console.log("到底了" + this.loadCount);
        return;
      }
      this.loadList.push(this.imgList[this.loadCount]);
    },
    preloadNextImages(count) {
        // if (count >= this.imgList.length) {
        //   console.log(this.imgList.length)
        //   return;
        // }
        // const img = new Image();
        // img.src = this.imgList[count]
        // img.onload = () => {
        //   this.loadList.push(this.imgList[count]);
        //   this.preloadNextImages(count + 1);
        // };
        // img.onerror = () => {
        //   this.loadList.push(this.imgList[count]);
        // }

    },
  },

  props:{
    id:String
  }

}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
  padding-top: 60px; /* 为固定标题留出空间 */
}



.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 15px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
}
.fixed-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #409EFF;
}

.container {
  overflow:auto;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}






.related_box {
  border-radius: 8px;
  height: 100%;
}
.related_box .el-image {
  width: 100%;
  height: 100%;
}

.darks{
  color: pink;
  background-color: black;
}
</style>
