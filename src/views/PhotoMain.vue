<template>
  <div :class="isDark ? 'darks':''" >
    <div :style="{ height: tabHeight }">
      <tabs-vips @handleSelect="handleSelect" @handleSearch="handleSearch" @toggleDark="toggleDark"  :is-dark="isDark"></tabs-vips>
    <div class="centers" v-if="totalPage > 1">
      <div class="slider" >
        <el-slider v-model="currentPage" :min="minPage" :max="totalPage" @change="changePage" show-input size="small"/>
      </div>
    </div>
    </div>
        <div  infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto;"  :style="{ height: cardHeight }">
        <photo-card ref="photoCard" :imglist="imgList" @selectItem="selectItem" @selectStar="selectStar" @selectDownload="selectDownload"></photo-card>
          <div class="centers">
            <p v-if="pLoading" style="color:skyblue;font-size: 20px;">正在努力加载中</p>
            <p v-if="pmore" style="color:skyblue;font-size: 20px;">已经没有数据可以加载了</p>
          </div>
        </div>
    <div class="centers">
      <p  style="color:skyblue;font-size: 20px;" :style="{ height: folderHeight }">图片来自于网络，侵权联系删除</p>
    </div>
</div>




</template>

<script>
import PhotoCard from '../components/PhotoCard.vue'
import TabsVips from  '../components/TabsVips.vue'
import axios from "axios";
import {ElLoading} from "element-plus";
import loadZip from "@/router/loadZip.js";
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
  data(){
    return{
      cardHeight:'',
      tabHeight:'',
      folderHeight:'',
      pmore:false,
      minPage:1,
      //图片数据
      imgList: [],
      //当前分类
      tableName:localStorage.getItem("superTableName") == null?'Aiyouwu':localStorage.getItem("superTableName"),
      //当前页码
      currentPage: 1,
      //搜索内容
      search:'',
      //总页数
      totalPage:93,
      //总数据
      totalCount: 2162,
      loading:[],
      //暗黑模式
      isDark:null,
      pLoading:false,
      preLoadList:[]
    }

  },
  created() {
    this.$nextTick(() => {
      let docHeight = document.documentElement.clientHeight;
      console.log("可视区域高度", docHeight);
      this.cardHeight = docHeight*0.8 + "px";
      this.tabHeight = docHeight*0.14 + 'px';
      this.folderHeight = docHeight * 0.05+'px';
      console.log(this.cardHeight , this.tabHeight ,  this.folderHeight)
    });
    //0为false 1 为 ture
    let item = localStorage.getItem("isDark");
    if (item == null){
      localStorage.setItem("isDark","0")
      this.isDark = false
    }else {
      this.isDark = (item === "0");
    }
    let superdata = localStorage.getItem("superData");
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
  methods:{
    load(){
      if (!this.pLoading){
        if (this.currentPage >= this.totalPage){
          this.pmore = true;
        }else {
          this.pmore = false;
          this.pLoading=true;
          this.currentPage += 1;
          let b = timeStrapCheck(this.tableName + "_Time_" + this.currentPage);
          this.$getValue(this.tableName + "_" + this.currentPage).then(tableData => {
            if (tableData == null || b){
              axios.post(`${this.$domainUrl}/photo`, {
                "tables": this.tableName,
                "search": this.search,
                "row": this.currentPage
              }).then(res => {
                if (res.data.code === 200){
                  this.imgList=this.imgList.concat(res.data.data.records);
                  res.data.data.records.forEach(e =>{
                    let date = JSON.stringify(e);
                    this.$setValue("photo_" + e.id,date);
                    e.collection = [];
                  })
                  let e = JSON.stringify(res.data.data);
                  localStorage.setItem("superData",e)
                  this.$setValue(this.tableName + "_" + this.currentPage,res.data.data)
                }
                addTimeStrap(this.tableName + "_Time_" + this.currentPage)
              }).catch(()=>{
                    this.pLoading=false;
                    this.currentPage -= 1;
                }
              )
            }else {
              let resf = tableData;
              this.imgList=this.imgList.concat(resf.records);
            }
          })
        }
      }
    },
    selectItem(id){
      // this.$router.push('/show/'+ id)
      if (!(this.tableName === 'History')){
        this.addHistory(id);
      }
      window.open('/#/show/'+ id);
    },
    addHistory(id){
      axios.get(`${this.$domainUrl}/photo/history/` + id).then(() => {})
    },
    selectStar(i){
      console.log(this.imgList[i].id);
      axios.get(`${this.$domainUrl}/photo/like/` + this.imgList[i].id).then(e => {
        if (e.data.code === 2001){
          this.imgList[i].star = !this.imgList[i].star;
        }
      })
    },
    selectDownload(i){
      this.$getValue("photo_" + i).then(res => {
        if (res == null){
          axios.get(`${this.$domainUrl}/photo/` + i).then(e => {
            if (e.data.code === 200){
              let date = JSON.stringify(e.data.data);
              this.$setValue("photo_" + i,date)
              // this.downloadPhoto(date)
              this.downle(date);
            }
          }).catch(error => {
                console.log("error" + error)
              }
          )
        }else {
          // this.downloadPhoto(res)
          this.downle(res);
        }
      })
    },
    downle(res){
      let resf = JSON.parse(res);
      let parse = JSON.parse(resf.collection);
      let count = 0;
      parse.forEach(item => {
        this.ddle(resf.domain + "/" + resf.prefix + "/" + resf.suffix + '/' + item,count);
        count++;
      })
    },
    downloadPhoto(res){
      let fileArr = [
      ]
      let resf = JSON.parse(res);
      let parse = JSON.parse(resf.collection);
      this.items = parse;
      let count = 0;
      parse.forEach(item => {
        if (count % 3 == 0){
          fileArr.push({
            fvUrl:"/yao/" + resf.prefix + "/" + resf.suffix + '/' + item,
            fvName: item
          })
        }else if (count %3 == 1){
          fileArr.push({
            fvUrl:"/wan/" + resf.prefix + "/" + resf.suffix + '/' + item,
            fvName: item
          })
        }else if (count %3 ==2){
          fileArr.push({
            fvUrl:"/hui/" + resf.prefix + "/" + resf.suffix + '/' + item,
            fvName: item
          })
        }
      count++;
      })
      loadZip(fileArr,resf.name);
    },
    //图片加载
    imgListLoad(){
      const loading = ElLoading.service({
        lock: true,
        text: '正在加载中请稍后...如果此状态时间过长请刷新重试',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      this.imgList = [];
      let timeStampCheckName;
      let getValueName;
      if (this.search === ''){
      timeStampCheckName = this.tableName + "_Time_" + this.currentPage;
      getValueName = this.tableName + "_" + this.currentPage;
      }else {
        timeStampCheckName = this.search + "_Time_" + this.currentPage;
        getValueName = this.search + "_" + this.currentPage;
      }
      let b = timeStrapCheck(timeStampCheckName);
      this.$getValue(getValueName).then(tableData => {
          if (tableData == null || b || this.tableName === 'like' || this.tableName === 'History'){
            axios.post(`${this.$domainUrl}/photo`, {
              "tables": this.tableName,
              "search": this.search,
              "row": this.currentPage
            }).then(res => {
              if (res.data.code === 200){
                this.$refs.photoCard.clearLoading();
                this.imgList = res.data.data.records;
                this.totalCount = res.data.data.total;
                this.currentPage = res.data.data.current;
                this.totalPage = res.data.data.pages;
                res.data.data.records.forEach(e =>{
                  let date = JSON.stringify(e);
                  this.$setValue("photo_" + e.id,date);
                  e.collection = [];
                })
                this.$setValue(getValueName,res.data.data)
              }
              addTimeStrap(this.tableName + "_Time_" + this.currentPage)
              loading.close();
              localStorage.setItem("superData",JSON.stringify( res.data.data));
            }).catch(()=>{
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
            localStorage.setItem("superData",JSON.stringify(tableData));
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
        let timeStampCheckName;
        if (this.search === ''){
          timeStampCheckName = this.tableName + "_Time_" + pageNumber;
        }else {
          timeStampCheckName = this.search + "_Time_" + pageNumber;
        }
        let b = timeStrapCheck(timeStampCheckName);
        if (b){
          this.preLoadList.push(pageNumber);
        }
        this.PreLoadStartAdd(++pageNumber,++count)
      }
    },
    PreLoadStartMiuns(pageNumber,count){
      if (pageNumber < 1 || count >= 5){
      }else {
        let timeStampCheckName;
        if (this.search === ''){
          timeStampCheckName = this.tableName + "_Time_" + pageNumber;
        }else {
          timeStampCheckName = this.search + "_Time_" + pageNumber;
        }
        let b = timeStrapCheck(timeStampCheckName);
        if (b){
          this.preLoadList.push(pageNumber);
        }
        this.PreLoadStartMiuns(--pageNumber,++count)
      }
    },
    //预加载数据
    Preload(){
      let flag = false;
      if (this.search === ''){
        flag = true;
      }
      console.log(this.preLoadList)
      let timeStampCheckName;
      let getValueName;
          axios.post(`${this.$domainUrl}/photo/preload`, {
            "tables": this.tableName,
            "search": this.search,
            "row": this.preLoadList
          }).then(res => {
            if (res.data.code === 200) {
              res.data.data.forEach(e => {
               e.records.forEach(f => {
                  let date = JSON.stringify(f);
                  this.$setValue("photo_" + f.id, date);
                  f.collection = [];
                })
                if (flag){
                  timeStampCheckName = this.tableName + "_Time_" + e.current;
                  getValueName = this.tableName + "_" + e.current;
                }else {
                  timeStampCheckName = this.search + "_Time_" + e.current;
                  getValueName = this.search + "_" + e.current;
                }
                this.$setValue(getValueName,e)
                addTimeStrap(timeStampCheckName)
              })
            }
        })
    },
    //翻页逻辑
    pageTurning(e){
      this.currentPage = e;
      this.imgListLoad();
    },
    changePage(){
      this.imgListLoad();
    },
    //切换分类逻辑
    handleSelect(item){
      this.currentPage = 1;
      this.tableName = item
      localStorage.setItem("superTableName",item)
      this.search = ''
    },
    //搜索逻辑
    handleSearch(e){
      this.currentPage = 1;
      this.search = e
    },
    //切换暗黑模式
    toggleDark(){
      this.isDark = !this.isDark
    },
    //暗黑模式渲染
    openDark(){
      const html = document.querySelector('html')
      if (html) {
        if (this.isDark) {
          html.classList.remove("light");
          html.classList.add("dark");
          localStorage.setItem("isDark","0")
        } else {
          html.classList.remove("dark");
          html.classList.add("light");
          localStorage.setItem("isDark","1")
        }
      }
    },
    ddle(url,count){
      let iframe = document.getElementById("iframe" +count);
      if (iframe == null){
        const iframe = document.createElement("iframe");
        iframe.setAttribute("id","iframe"+ count)
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
    TabsVips,
  },

  //数据监听
  watch:{
    isDark(){this.openDark()},
    tableName(){this.imgListLoad()},
    search(){this.imgListLoad()},
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
