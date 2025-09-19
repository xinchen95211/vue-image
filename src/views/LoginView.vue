<template>
    <div class="login-wrapper" >
      <div class="header" v-loading="loading">
        <p>登陆</p>
        <el-form  class="form-wrapper" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto" >
          <el-form-item  prop="username">
            <el-input type="text" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="ruleForm.username" autocomplete="off"  placeholder="用户名"  maxlength="30" class="input-item" ></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码" class="input-item" minlength="6" maxlength="30" show-password></el-input>
          </el-form-item>
          <!--    <el-form-item  prop="checkCode" class="input-item-row">-->
          <!--      <el-input v-model="ruleForm.checkCode" class="input-item" placeholder="验证码"></el-input>-->
          <!--      <img :src="checkCodeImg"  @click="getCheckCodeImgPost()">-->
          <!--    </el-form-item>-->
          <el-form-item>
            <el-button class="loginBtn" @click="login('ruleForm')" ref="logins">登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
<!--      <div class="msg">-->
<!--        <a style="color: blue" @click="this.$router.push('/retrievePassword')">忘记密码</a>-->
<!--      </div>-->
<!--      <div class="msg">-->
<!--        没有账户?-->
<!--        <a style="color: blue" @click="this.$router.push('/register')">注册一个</a>-->
<!--      </div>-->
<!--      <div @click="noRegister">不想注册请点我</div>-->
    </div>

</template>
<script>
import {defineComponent} from "vue";
import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
import { Base64 } from 'js-base64';

export default defineComponent({
  data() {
    // var checkCheckCode = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入验证码'));
    //   } else {
    //     let s = this.checkCodeVerity();
    //     if (s) {
    //       callback();
    //     } else {
    //       callback(new Error('验证码输入错误'));
    //     }
    //
    //   }
    // };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      }else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }else if (value.length < 6){
        callback(new Error('密码太短了'));
      } else {
        callback();
      }
    };
    return {
      ruleForm:{
        username: '',
        password: '',
        // checkCode:'',
      },
      loading:false,
      // checkCodeImg:'',
      // uuid:localStorage.getItem("uuid"),

      rules: {
        username: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        // checkCode: [
        //   { validator: checkCheckCode, trigger: 'blur' }
        // ]
      }
    };
  },
  created() {
    let username = this.$cookies.get("dXNlcm5hbWU%3D");
    let password = this.$cookies.get("cGFzc3dvcmQ%3D");
    if (username != null){
      this.ruleForm.username = Base64.decode(username);
      this.ruleForm.password = Base64.decode(password);
    }

  },
  methods: {
    noRegister(){
      this.ruleForm.username = 'test2';
      this.ruleForm.password = '1234567';
    },
    login(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = ElLoading.service({
            lock: true,
            text: '正在登陆请稍后...',
            background: 'rgba(0, 0, 0, 0.8)',
          })
          axios.post(`${this.$domainUrl}/login`,this.ruleForm,{headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
          }).then(e => {
            if (e.data.code === 2000){
              this.$authorities.length = 0;
              localStorage.setItem("token",e.data.data.token);
              e.data.data.virgoUserVO.authorities.forEach(e => {
                this.$authorities.push(e.authority);
              })
              this.$username = e.data.data.virgoUserVO.username;
              localStorage.setItem("username",this.$username)
              localStorage.setItem("authorities",JSON.stringify(this.$authorities))
              ElMessage.success(e.data.message)
              // setTimeout(() => {
              this.$router.replace("/");
              // }, 2000);
              setTimeout(() => {
                loading.close();
              }, 2000);
              //记住用户名密码
              this.$cookies.set("dXNlcm5hbWU%3D",Base64.encode(this.ruleForm.username));
              this.$cookies.set("cGFzc3dvcmQ%3D",Base64.encode(this.ruleForm.password));
            }else {
              loading.close();
            }
          }).catch(() =>{
            loading.close();
            ElMessage.error("与服务器连接发生错误，请稍后再试")
          })

        } else {
          return false;
        }
      });
    },
    getCheckCodeImgPost(){
      axios.post(`${this.$domainUrl}/logins/checkcode`,{"key":this.uuid},{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(e => {
        if (e.data.code === 200){
          this.checkCodeImg= e.data.data;
        }
      })
    },
    checkCodeVerity(){
      axios.post(`${this.$domainUrl}/logins/verify`,{"key":this.uuid,"checkCode":this.ruleForm.checkCode},{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(e => {
        return e.data.code === 200;
      })
    },
    //加载
    openFullScreen2() {
      const loading = ElLoading.service({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    }
  },
})


</script>

<style>

</style>
