<template>
  <div style="position: relative;z-index: -999; ">
    <vue3VideoPlay id="vueVideo" v-bind="options" :poster="poster" @error="errorLoad"/>
  </div>
<!--  <div class="zan">-->
<!--    <el-icon size="50px" color="skyblue" @click="selectStar(id)">-->
<!--      <star v-if="star"></star>-->
<!--      <star-filled v-if="!star"></star-filled>-->
<!--    </el-icon>-->
<!--  </div>-->
</template>

<script>
// import {Star, StarFilled} from "@element-plus/icons-vue";
import axios from "axios";
import Vue3VideoPlay from "vue3-video-play/lib/video-play/main.vue";
import {ElMessage} from "element-plus";

export default {
  name: "VideoShow",
  components: {Vue3VideoPlay},
  data(){
    return{
      options:{
        width: '800px', //播放器高度
        height: '450px', //播放器高度
        color: "#409eff", //主题色
        speed:true, //关闭进度条拖动
        title: '', //视频名称
        pageFullScreen:false,
        webFullScreen:true,
        fullscreen:true,
        src:"",
        controlBtns:['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'fullScreen']
      },
      poster:'',
      domainList:[],
      iterateeCount:0,
      videoURI:'',
    }
  },
  created() {
    // this.poster=this.$route.query.poster
    // this.getVideoUrl(this.$route.query.id);
    // this.getVideoUrl(this.id)
    this.mount(this.id)
  },
  methods:{
    mount(id) {
      // let res = localStorage.getItem("photo_" + id);
      this.$getValue("video_" + id).then(res => {
        if (res == null) {
          axios.get(`${this.$domainUrl}/video/` + id).then(e => {
            if (e.data.code === 200) {
              let date = JSON.stringify(e.data.data);
              this.$setValue("video_" + id, date)
              this.loadimg(date)
            }
          }).catch(error => {
                console.log("error" + error)
              }
          )
        } else {
          this.loadimg(res)
        }
      })
    },
    loadimg(res){
      let data = JSON.parse(res);
      this.domainList = data.domainList;
      this.videoURI = data.videoUri;
      this.options.src = this.domainList[Math.floor(Math.random() * (this.domainList.length))] + data.videoUri;
      // this.poster = data.domain + '/' + data.prefix + '/' +data.suffix + '/' +data.thumbnail;
      this.poster = this.domainList[Math.floor(Math.random() * (this.domainList.length))] + '/' + data.prefix + '/' +data.suffix + '/' +data.thumbnail;
    },
    // selectStar(id){
    //   axios.get("api/video/like/" + id).then(e => {
    //     if (e.data.code === 2001) {
    //       this.stars = !this.stars
    //     }
    //   })
    // },
    getVideoUrl(id){
      axios.get(`${this.$domainUrl}/video/${id}`).then(e => {
        if (e.data.code === 200){
          if (e.data.data == null){
            ElMessage.error("这个视频暂时有问题,换一个看看吧")
          }else{
            let dates = JSON.stringify(e.data.data);
            this.$setValue("video_" + id, dates)
            let data = e.data.data;
            this.domainList = data.domainList;
            this.videoURI = data.videoUri;
            this.options.src = data.domain + data.videoUri;
            this.poster = data.domain + '/' + data.prefix + '/' +data.suffix + '/' +data.thumbnail;

          }
        }
      })
    },
    errorLoad(){
      if (this.options.src === ''){return;}

      if (this.iterateeCount === this.domainList.length){
        ElMessage.error("这个视频有点问题，换一个看看吧")
        return;
      }
      this.options.src = this.domainList[this.iterateeCount] + this.videoURI;
      console.log(this.options.src)
      this.iterateeCount++;
    }
  },

  props:{
    id:String
  }
}
</script>

<style scoped>
.zan{
  float: right;
  margin-top:500px;
  margin-right: 10px;
}
</style>