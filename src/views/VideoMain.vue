<template>
  <div :class="isDark ? 'darks':''" >
    <div :style="{ height: tabHeight }">
      <tabs-video @handleSelect="handleSelect" @handleSearch="handleSearch" @toggleDark="toggleDark"  :is-dark="isDark"></tabs-video>
      <div class="centers" v-if="totalPage > 1">
        <!--      <paglina-tion  :totalCount="totalCount" :currentPage="currentPage" @pageTurning="pageTurning"></paglina-tion>-->
        <div class="slider">
          <el-slider v-model="currentPage" :min="minPage" :max="totalPage" @change="changePage" show-input size="small"/>
        </div>
      </div>
    </div>
    <div class="infinite-list" infinite-scroll-immediate="false" style="overflow: auto;"  :style="{ height: cardHeight }">
      <photo-card ref="photoCard" :imglist="imgList" @selectItem="selectItem" @selectStar="selectStar" @selectDownload="selectDownload">></photo-card>
      <div class="centers">
        <p v-if="pLoading" style="color:skyblue;font-size: 20px;">正在努力加载中</p>
        <p v-if="pmore" style="color:skyblue;font-size: 20px;">已经没有数据可以加载了</p>
      </div>
    </div>
    <div class="centers">
      <p  style="color:skyblue;font-size: 20px;" :style="{ height: folderHeight }">视频来自于网络，侵权联系删除</p>
    </div>
  </div>
</template>

<script>
import PhotoCard from '../components/PhotoCard.vue'
import TabsVideo from  '../components/TabsVideo.vue'
import axios from "axios";
import {ElLoading} from "element-plus";

const timeStrapCheck = (name) => {
  let item = localStorage.getItem(name);
  if (item == null){
    return true;
  }else {
    let parse = JSON.parse(item);
    let time = new Date().toISOString();
    return parse < time;
  }
}
const addTimeStrap = (name) =>{
  let time = new Date();
  time.setDate(time.getDate() + 5);
  localStorage.setItem(name,JSON.stringify(time))
}
export default {
  name: "PhotoMain",
  data() {
    return {
      cardHeight: '',
      tabHeight: '',
      folderHeight: '',
      pmore: false,
      minPage: 1,
      //图片数据
      imgList: [],
      //当前分类
      tableName: localStorage.getItem("superVideoTable") == null ? '/':localStorage.getItem("superVideoTable"),
      //当前页码
      currentPage: 1,
      //搜索内容
      search: '',
      //总页数
      totalPage: 93,
      //总数据
      totalCount: 2162,
      loading: [],
      //暗黑模式
      isDark: null,
      pLoading: false,
      preLoadList:[]
    }

  },
  created() {
    this.$nextTick(() => {
      let docHeight = document.documentElement.clientHeight;
      console.log("可视区域高度", docHeight);
      this.cardHeight = docHeight * 0.8 + "px";
      this.tabHeight = docHeight * 0.14 + 'px';
      this.folderHeight = docHeight * 0.05 + 'px';
      console.log(this.cardHeight, this.tabHeight, this.folderHeight)
    });
    //0为false 1 为 ture
    let item = localStorage.getItem("isDark");
    if (item == null) {
      localStorage.setItem("isDark", "0")
      this.isDark = false
    } else {
      this.isDark = (item === "0");
    }

    let superdata = localStorage.getItem("superVideoData");
    if (superdata != null){
      try {
        let parse = JSON.parse(superdata);
        this.imgList = parse.records;
        this.totalCount = parse.total;
        this.currentPage = parse.current;
        this.totalPage = parse.pages;
      }catch{
        this.imgListLoad();
      }
    }else {
      this.imgListLoad();
    }


  },
  methods: {
    load() {
      if (!this.pLoading) {
        if (this.currentPage >= this.totalPage) {
          this.pmore = true;
        } else {
          this.pmore = false;
          this.pLoading = true;
          this.currentPage += 1;
          axios.post(`${this.$domainUrl}/video`, {
            "tag": this.tableName,
            "row": this.currentPage
          }).then(res => {
            if (res.data.code === 200) {
              this.imgList = this.imgList.concat(res.data.data.records);
              this.pLoading = false;
              let e = JSON.stringify(res.data.data);
              res.data.data.records.forEach(fe => {
                let date = JSON.stringify(fe);
                this.$setValue("video_" + fe.id,date);
              })
              localStorage.setItem("superVideoData",e)
            }
          }).catch(error => {
                this.pLoading = false;
                this.currentPage -= 1;
                console.log(error)
              }
          )
        }
      }
    },
    selectItem(id) {
      // this.$router.push({name:'/videoshow',query: {id:id,poster:}})
      if (!(this.tableName === 'History')){
        this.addHistory(id);
      }
      window.open(`/#/videoshow/${id}`);

    },
    addHistory(id){
      axios.get(`${this.$domainUrl}/video/history/` + id).then(() => {})
    },
    selectStar(i) {
      console.log(this.imgList[i].id);
      axios.get(`${this.$domainUrl}/video/like/` + this.imgList[i].id).then(e => {
        if (e.data.code === 2001) {
          this.imgList[i].star = !this.imgList[i].star;
        }
      })
    },
    //视频加载
    imgListLoad() {
      const loading = ElLoading.service({
        lock: true,
        text: '正在加载中请稍后...如果此状态时间过长请刷新重试',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      this.imgList = [];
      let b = timeStrapCheck("Video_Time_" + this.currentPage);
      this.$getValue("Video_" + this.currentPage).then(tableData => {
            if (tableData == null || b || this.tableName === 'like' || this.tableName === 'History'){
              axios.post(`${this.$domainUrl}/video`, {
                "tag": this.tableName,
                "row": this.currentPage
              }).then(res => {
                if (res.data.code === 200) {
                  this.$refs.photoCard.clearLoading();
                  this.imgList = res.data.data.records;
                  this.totalCount = res.data.data.total;
                  this.currentPage = res.data.data.current;
                  this.totalPage = res.data.data.pages;
                  res.data.data.records.forEach(e => {
                    let date = JSON.stringify(e);
                    this.$setValue("video_" + e.id,date);
                  })
                  if (this.tableName !== 'like' && this.tableName !== 'History'){
                    this.$setValue("Video_" + this.currentPage,res.data.data)
                    addTimeStrap("Video_Time_" + this.currentPage)
                  }
                }
                loading.close();
                localStorage.setItem("superVideoData",JSON.stringify(res.data.data));
              }).catch(() => {
                setTimeout(() => {
                  loading.close();
                  this.imgListLoad();
                }, 5000);
            })
          }else {
              let resf = tableData;
              this.$refs.photoCard.clearLoading();
              this.imgList = resf.records;
              this.totalCount = resf.total;
              this.currentPage = resf.current;
              this.totalPage = resf.pages;
              loading.close();
              localStorage.setItem("superVideoData",JSON.stringify(tableData));
          }

      })
      this.preLoadList.length = 0;
      //执行预加载
      this.PreLoadStartAdd(this.currentPage+1,0);
      this.PreLoadStartMiuns(this.currentPage-1,0);
      this.Preload();
    },
    PreLoadStartAdd(pageNumber,count){
      if (pageNumber > this.totalPage || count >= 5){
      }else {
        let b = timeStrapCheck("Video_Time_" + pageNumber);
        if (b){
          this.preLoadList.push(pageNumber);
        }
        this.PreLoadStartAdd(++pageNumber,++count)
      }
    },
    PreLoadStartMiuns(pageNumber,count){
      if (pageNumber < 1 || count >= 5){
      }else {
        let b = timeStrapCheck("Video_Time_" + pageNumber);
        if (b){
          this.preLoadList.push(pageNumber);
        }
        this.PreLoadStartMiuns(--pageNumber,++count)
      }
    },
    Preload(){
          axios.post(`${this.$domainUrl}/video/preload`, {
            "tag": this.tableName,
            "row": this.preLoadList
          }).then(res => {
            if (res.data.code === 200) {
              res.data.data.forEach(e => {
                e.records.forEach(f => {
                  this.$setValue("video_" + f.id, JSON.stringify(f));
                })
                if (this.tableName !== 'like'){
                  this.$setValue("Video_" + e.current, e)
                  addTimeStrap("Video_Time_" + e.current)
                }

              })
            }
          })
    },
    //翻页逻辑
    pageTurning(e) {
      this.currentPage = e;
      this.imgListLoad();
    },
    changePage() {
      this.imgListLoad();
    },
    //切换分类逻辑
    handleSelect(item) {
      this.currentPage = 1;
      this.tableName = item;
      localStorage.setItem("superVideoTable",item)
      // this.imgListLoad();
    },
    //搜索逻辑
    handleSearch(e) {
      this.currentPage = 1;
      this.search = e
    },
    //切换暗黑模式
    toggleDark() {
      this.isDark = !this.isDark
    },
    //暗黑模式渲染
    openDark() {
      const html = document.querySelector('html')
      if (html) {
        if (this.isDark) {
          html.classList.remove("light");
          html.classList.add("dark");
          localStorage.setItem("isDark", "0")
        } else {
          html.classList.remove("dark");
          html.classList.add("light");
          localStorage.setItem("isDark", "1")
        }
      }
    },
    selectDownload(id){
      const loading = ElLoading.service({
        lock: true,
        text: '正在准备下载连接，请稍后...',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      this.$getValue("video_" + id).then(res => {
        if (res == null) {
          axios.get(`${this.$domainUrl}/video/` + id).then(e => {
            if (e.data.code === 200) {
              let date = JSON.stringify(e.data.data);
              this.$setValue("video_" + id, date)
              this.ddle(date.domain + date.videoUri);
            }
          }).catch(error => {
                console.log("error" + error)
              }
          )
        } else {
          let data = JSON.parse(res);
          this.ddle(data.domain + data.videoUri)
        }
        setTimeout(() => {
          loading.close();
        }, 3000);
      })
    },
    ddle(url){
        let iframe = document.getElementById("iframe");
        if (iframe == null){
          const iframe = document.createElement("iframe");
          iframe.setAttribute("id","iframe")
          iframe.setAttribute("hidden","hidden");
          document.body.appendChild(iframe);
          iframe.onload = () => {
            if(iframe){
              iframe.setAttribute('src','about:blank');
            }
          };
          iframe.setAttribute("src",url);
        }else {
          iframe.setAttribute("src",url);
        }
    }
  },

  components: {
    PhotoCard,
    TabsVideo,
  },

  //数据监听
  watch: {
    isDark() {
      this.openDark()
    },
    tableName() {
      this.imgListLoad()
    },
    search() {
      this.imgListLoad()
    },
    // currentPage(){this.imgListLoad()},
  }
}
</script>

<style scoped>
.centers{
  display: flex;
  justify-content: center;
}
.slider{
  width: 90vw;
  height: 5vh;
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>