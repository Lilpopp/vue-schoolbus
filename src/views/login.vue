<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">校车调度系统</div>
      <el-form :model="param" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="password"
              v-model="param.password"
              @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <div class="login-btn">
          <el-button @click="reg = true">没有账号？点击注册账号</el-button>
        </div>
        <el-dialog title="注册账号" v-model="reg" width="30%">
          <el-form label-width="100px">
            <el-form-item label="用户名：">
              <el-input v-model="regFrom.username" placeholder="请填写用户名"></el-input>
            </el-form-item>
          </el-form>
          <el-form label-width="100px">
            <el-form-item label="密码">
              <el-input v-model="regFrom.password" placeholder="请填写密码"></el-input>
            </el-form-item>
          </el-form>
          <el-form label-width="100px">
            <el-form-item label="性别">
              <el-select v-model="regFrom.sex" placeholder="请选择性别">
                <el-option value="男"/>
                <el-option value="女"/>
              </el-select>

            </el-form-item>
          </el-form>
          <el-form label-width="100px">
            <el-form-item label="电话">
              <el-input v-model="regFrom.phone" placeholder="请填写电话号码"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
                <span class="dialog-footer">
                    <el-button @click="reg = false">取 消</el-button>
                    <el-button type="primary" @click="saveCreate">确 定</el-button>
                </span>
          </template>
        </el-dialog>
      </el-form>
    </div>
  </div>
</template>

<script>
import {ref, reactive} from 'vue';
import {useTagsStore} from '../store/tags';
import {usePermissStore} from '../store/permiss';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {Lock, User} from '@element-plus/icons-vue';
import {login, register} from "../api";
import jwtDecode from 'jwt-decode'

const reg = ref(false);
const regFrom = reactive({
  username: "",
  password: "",
  sex: "",
  phone: "",
});
export default {
  setup() {
    const router = useRouter();
    const param = reactive({
      username: '',
      password: ''
    });
    const rules = {
      username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
      password: [{required: true, message: '请输入密码', trigger: 'blur'}]
    };
    const addRules = reactive({
      beginSite: [
        {required: true, message: '请输入排班！', trigger: 'blur'},
        {min: 2, max: 20, message: '名称长度应介于2到20之间', trigger: 'blur'},
        {type: 'string', message: '请输入汉字！', trigger: 'blur'},
      ],
      endSite: [
        {required: true, message: '请输入排班！', trigger: 'blur'},
        {min: 2, max: 20, message: '名称长度应介于2到20之间', trigger: 'blur'},
        {type: 'string', message: '请输入汉字！', trigger: 'blur'},
      ],
    })
    const loginForm = ref()
    const permiss = usePermissStore();
    const submitForm = () => {
      loginForm.value.validate(() => {
        login(param.username, param.password).then((res) => {
          if (res.data.code === 0) {
            ElMessage.success('登录成功');
            localStorage.setItem('username', param.username);
            localStorage.setItem('token', res.data.data.token);
            const data = jwtDecode(res.data.data.token);
            localStorage.setItem('is_super', data.is_super);
            var user;
            if (data.is_super === 'true'){
              user = 'admin'
            }else{
              user = 'user'
            }
            const keys = permiss.defaultList[user];
            localStorage.setItem('ms_keys', JSON.stringify(keys));
            router.push('/');
          } else {
            ElMessage.error('登录失败' + res.data.msg);
          }
        });
      });
    };
    const saveCreate = () => {
      reg.value = false
      register(regFrom.username, regFrom.password, regFrom.sex, regFrom.phone).then(res => {
        if (res.data.code === 0) {
          ElMessage.success("注册成功")
        } else {
          ElMessage.error("注册失败" + res.data.msg)
        }
      })
    }
    const tags = useTagsStore();
    tags.clearTags();
    return {
      param,
      rules,
      loginForm,
      reg,
      regFrom,
      addRules,
      saveCreate,
      submitForm,
      register,
      User,
      Lock
    };
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
