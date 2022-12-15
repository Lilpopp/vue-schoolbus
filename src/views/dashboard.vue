<template>
    <div>
            <el-col :span="500">
                <el-card shadow="hover" class="mgb20" style="height:500px;">
                    <div class="user-info">
                        <img src="../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ name }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>

                </el-card>
            </el-col>
    </div>
</template>

<script>

export default {
    name: "dashboard",
    components: {  },
    setup() {
        const name = localStorage.getItem("username");
        const isSuper = localStorage.getItem("is_super");
        var role;
        if (isSuper === 'true'){
          role = '管理员'
        }else{
          role = '普通用户'
        }
        return {
          name,
          role,
        };
    },
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}
.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}
.user-info-list span {
    margin-left: 70px;
}
.mgb20 {
    margin-bottom: 20px;
}
</style>