<template>
  <nav class="navbar navbar-expand-lg"  style="width: 100%;height: 8vh" :class="isDark ? ' ':'lights'">
    <div class="container-fluid" >
      <el-dropdown trigger="click"  class="navbar-brand" @command="handleCommand">
    <span>
      <div>
          <el-avatar> {{ this.$username }} </el-avatar>
      </div>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="dark" v-if="!isDark">深色模式</el-dropdown-item>
            <el-dropdown-item command="dark" v-if="isDark">浅色模式</el-dropdown-item>
            <el-dropdown-item command="clear">清除缓存</el-dropdown-item>
            <el-dropdown-item command="retrievePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="Feedback">用户反馈</el-dropdown-item>
            <el-dropdown-item command="suiji">随机视频</el-dropdown-item>
            <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div  class="navbar-toggler" @click="goVideo">
        <div >视频站</div>
      </div>

      <button  class="navbar-toggler"  @click="drawer = true" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" ></span>
      </button>
      <div class="collapse navbar-collapse hidden-md-and-down" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              精
            </a>
            <ul class="dropdown-menu">
              <li v-for="(item,i) of tablebs"
                  :key="item"
              ><a  v-if="i % 6 === 0" class="dropdown-item" :class="buttonStyle[i]" @click="handleSelect(item.tablesname,i)">{{ item.name }}</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              品
            </a>
            <ul class="dropdown-menu">
              <li v-for="(item,i) of tablebs"
                  :key="item"
              ><a  v-if="i % 6 === 1" class="dropdown-item" :class="buttonStyle[i]" @click="handleSelect(item.tablesname,i)">{{ item.name }}</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button"    data-bs-toggle="dropdown" aria-expanded="false">
             美
            </a>
            <ul class="dropdown-menu">
              <li v-for="(item,i) of tablebs"
                  :key="item"
              ><a  v-if="i % 6 === 2" class="dropdown-item" :class="buttonStyle[i]" @click="handleSelect(item.tablesname,i)">{{ item.name }}</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button"  data-bs-toggle="dropdown" aria-expanded="false">
              图
            </a>
            <ul class="dropdown-menu">
              <li v-for="(item,i) of tablebs"
                  :key="item"
              ><a  v-if="i % 6 === 3" class="dropdown-item" :class="buttonStyle[i]"  @click="handleSelect(item.tablesname,i)">{{ item.name }}</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              鉴
            </a>
            <ul class="dropdown-menu">
              <li v-for="(item,i) of tablebs"
                  :key="item"
              ><a  v-if="i % 6 === 4" class="dropdown-item" :class="buttonStyle[i]" @click="handleSelect(item.tablesname,i)">{{ item.name }}</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              赏
            </a>
            <ul class="dropdown-menu">
              <li v-for="(item,i) of tablebs"
                  :key="item"
              ><a  v-if="i % 6 === 5" class="dropdown-item" :class="buttonStyle[i]" @click="handleSelect(item.tablesname,i)">{{ item.name }}</a></li>
            </ul>
          </li>
        </ul>

        <div class="hidden-md-and-down" @click="goVideo" >
          <div >视频站</div>
        </div>
        <div class="d-flex" role="search" >
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="inputText">
          <button class="btn btn-outline-success" @click="handleSearch" >Search</button>
        </div>
      </div>

    </div>

  </nav>

  <el-drawer
      title="导航页"
      v-model="drawer"
      direction="ltr"
      :before-close="handleClose"
      size="50%"
      style="text-align: center;align-items: center"
  >
    <div >
      <el-input placeholder="请输入内容" v-model="inputText" class="input-with-select" style="width: 100%">
      </el-input>
    </div>
    <el-button :icon="Search" @click="handleSearch"  style="width: 100%"></el-button>


    <div v-for="(item,i) of tablebs" :key="item">
      <el-button @click="handleSelect(item.tablesname,i)"  :type="buttonStyle[i]" style="width: 100%">
        {{item.name}}
      </el-button>
      <br>
    </div>
  </el-drawer>

</template>
<script>
import {Search} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";



export default {
  data(){
    return{
      dialogVisible: false,
      drawer: false,
      inputText:'',
      Search:Search,
      buttonStyle:new Array(52).fill(''),
      tablebs:[{"id":52,"tablesname":"History","name":"历史记录"},{"id":51,"tablesname":"like","name":"我喜欢"},{"id":1,"tablesname":"photo","name":"禁止瑟瑟"},{"id":2,"tablesname":"Aiyouwu","name":"爱尤物"},{"id":3,"tablesname":"Artgravia","name":"绝对领域"},{"id":4,"tablesname":"BoLoli","name":"波萝社"},{"id":5,"tablesname":"Candy","name":"网红馆"},{"id":6,"tablesname":"Cosplay","name":"Cosplay"},{"id":7,"tablesname":"DJAWA","name":"DJAWA"},{"id":8,"tablesname":"DKGirl","name":"御女郎"},{"id":9,"tablesname":"FeiLin","name":"嗲囡囡"},{"id":10,"tablesname":"Gangtaimeinv","name":"港台美女"},{"id":11,"tablesname":"Girlt","name":"果团网"},{"id":12,"tablesname":"Guochanmeinv","name":"国产美女"},{"id":13,"tablesname":"Huayan","name":"花の颜"},{"id":14,"tablesname":"HuaYang","name":"花漾"},{"id":15,"tablesname":"IMiss","name":"爱蜜社"},{"id":16,"tablesname":"LEGBABY","name":"美腿宝贝"},{"id":17,"tablesname":"LeYuan","name":"星乐园"},{"id":18,"tablesname":"MFStar","name":"模范学院"},{"id":19,"tablesname":"Micat","name":"瑞丝馆"},{"id":20,"tablesname":"MiiTao","name":"蜜桃社"},{"id":21,"tablesname":"MintYe","name":"MintYe薄荷叶"},{"id":22,"tablesname":"MissLeg","name":"蜜丝"},{"id":23,"tablesname":"MiStar","name":"魅妍社"},{"id":24,"tablesname":"Mtcos","name":"喵糖映画"},{"id":25,"tablesname":"Mtmeng","name":"模特联盟"},{"id":26,"tablesname":"MyGirl","name":"美媛馆"},{"id":27,"tablesname":"Neiyiyouwu","name":"内衣尤物"},{"id":28,"tablesname":"Oumeimeinv","name":"欧美美女"},{"id":29,"tablesname":"Pdl","name":"潘多拉"},{"id":30,"tablesname":"Rihanmeinv","name":"日韩美女"},{"id":31,"tablesname":"Siwameitui","name":"丝袜美腿"},{"id":32,"tablesname":"Slady","name":"Slady猎女神"},{"id":33,"tablesname":"Taste","name":"顽味生活"},{"id":34,"tablesname":"Tgod","name":"青豆客"},{"id":35,"tablesname":"TouTiao","name":"头条女神"},{"id":36,"tablesname":"Tuigirl","name":"推女郎"},{"id":37,"tablesname":"Tukmo","name":"兔几盟"},{"id":38,"tablesname":"Ugirls","name":"尤果网"},{"id":39,"tablesname":"Uxing","name":"优星馆"},{"id":40,"tablesname":"WingS","name":"影私荟"},{"id":41,"tablesname":"Xgyw","name":"性感尤物"},{"id":42,"tablesname":"XiaoYu","name":"画语界"},{"id":43,"tablesname":"XingYan","name":"星颜社"},{"id":44,"tablesname":"Xiuren","name":"秀人网"},{"id":45,"tablesname":"YaoJingShe","name":"妖精社"},{"id":46,"tablesname":"Yituyu","name":"艺图语"},{"id":47,"tablesname":"YouMei","name":"尤美"},{"id":48,"tablesname":"YouMi","name":"尤蜜荟"},{"id":49,"tablesname":"YouWu","name":"尤物馆"},{"id":50,"tablesname":"Ysweb","name":"Ysweb"}],
    }
  },
  created() {

  },
  mounted(){
    this.openDark()

  },
  methods:{
    open() {
      ElMessage.warning("还没有做")
      // ElMessageBox.prompt('请输入反馈内容', 'Tip', {
      //   confirmButtonText: '反馈',
      //   cancelButtonText: '取消',
      //   inputErrorMessage: '反馈内容',
      // })
      //     .then(({ value }) => {
      //       console.log(value);
      //     })
      //     .catch(() => {
      //
      //     })
    },
    goVideo(){
      if (this.$authorities.includes("VIDEO")){
        this.$router.push("/video")
      }else {
        ElMessage.warning("防止被查已禁止")
      }
    },
    handleCommand(command) {
      switch (command){
        case "dark":{this.toggleDark(); break}
        case "clear":{
          this.$deleteAll();
          ElMessage.success('缓存清除成功');
          let token = localStorage.getItem("token");
          let authorities = localStorage.getItem("authorities");
          let isDark = localStorage.getItem("isDark");
          let username = localStorage.getItem("username");
          localStorage.clear();
          localStorage.setItem("token",token);
          localStorage.setItem("authorities",authorities);
          localStorage.setItem("isDark",isDark);
          localStorage.setItem("username",username);
          break}
        case "logout":{this.$router.replace("/logout");break}
        case "retrievePassword":{this.$router.replace("/retrievePassword");break}
        case "suiji":{this.$router.replace("/rdm");break}
        case "Feedback":{this.open();break}
        default : {console.log(command);break}
      }
    },
    handleClose(done) {
      done();
    },
    handleSelect(item,i){
      if (item === 'photo' && !this.$authorities.includes("PHOTO")){
        ElMessage.warning("禁止色色")
        return;
      }

      for (let j = 0; j < this.buttonStyle.length; j++) {
        this.buttonStyle[j] = '';
      }
      this.buttonStyle[i] = 'primary';
      this.inputText = ''
      this.$emit("handleSelect",item)

    },
    handleSearch(){
      this.$emit("handleSearch",this.inputText)
    },
    toggleDark(){
      this.$emit("toggleDark")
    },
    openDark(){
      const html = document.querySelector('nav')
      if (html) {
        if (this.isDark) {
          html.setAttribute("data-bs-theme","dark")
        } else {
          html.removeAttribute("data-bs-theme")
        }
      }
    }

  },
  props:{
    isDark:Boolean,
  },
  watch:{
    isDark(){
      this.openDark();
    }
  }
}
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.lights{
  background-color: #e3f2fd;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.primary{
  color: var(--el-color-primary);;
}



</style>