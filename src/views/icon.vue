<template>
  <div>
    <!-- 小页面标题 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 车辆运行信息管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 排班表单 -->
    <div class="container">
      <!-- 标题工具栏 -->
      <div class="handle-box">
        <el-select v-model="query.mode" placeholder="查询" class="handle-select mr10">
          <el-option key="1" label="车辆名称查询" value="busName"></el-option>
          <el-option key="2" label="始发站查询" value="beginSite"></el-option>
          <el-option key="3" label="终点查询" value="endSite"></el-option>
        </el-select>
        <el-input v-if="query.mode === 'busName'" v-model="query.busName" placeholder="参数"
                  class="handle-input"></el-input>
        <el-input v-if="query.mode === 'beginSite'" v-model="query.beginSite" placeholder="参数"
                  class="handle-input"></el-input>
        <el-input v-if="query.mode === 'endSite'" v-model="query.endSite" placeholder="参数"
                  class="handle-input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加排班</el-button>
      </div>
      <!-- 排班表单 -->
      <el-table :data="scheduleData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="scheduleId" label="排班ID" align="center"></el-table-column>
        <el-table-column prop="beginSite" label="始发站" align="center"></el-table-column>
        <el-table-column prop="endSite" label="终点站" align="center"></el-table-column>
        <el-table-column prop="routeId" label="路线ID" align="center"></el-table-column>
        <el-table-column prop="beginTime" label="发车时间" align="center"></el-table-column>
        <el-table-column prop="busId" label="车辆ID" align="center"></el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 翻页器 -->
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 有校验 -->
    <el-dialog title="添加排班" v-model="addVisible" width="30%">
      <el-form :model="ruleForm" ref="ruleFormRef" :rules="addRules" label-width="100px">
        <el-form-item label="路线ID：">
          <el-select v-model="ruleForm.routeId" placeholder="请选择路线号" class="handle-select mr10">
            <el-option v-for="route in routeData"
                       :key="route.routeId"
                       :label="route.routeId+':'+route.rBeginSite+'->'+route.rEndSite"
                       :value="route.routeId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="始发站：">
          <el-select v-model="ruleForm.beginSite" placeholder="始发站" class="handle-select">
            <el-option v-for="site in (routeAllData.find(route => route.routeId === ruleForm.routeId))" :key="site"
                       :label="site"
                       :value="site"/>
          </el-select>
        </el-form-item>
        <el-form-item label="终点站：">
          <el-select v-model="ruleForm.endSite" placeholder="终点站" class="handle-select mr10">
            <el-option v-for="endSite in allSchedule" :key="endSite.routeId" :label="allSchedule.endSite"
                       :value="allSchedule.endSite"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆：">
          <el-select v-model="ruleForm.busId" placeholder="车辆ID" class="handle-select mr10">
            <el-option v-for="bus in busData" :key="bus.busId" :label="bus.busId+':'+bus.busName" :value="bus.busId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发车时间：">
          <el-input v-model="ruleForm.beginTime" placeholder="输入发车时间"/>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveCreate">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import {ref, reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {getDataParam, deleteData, allBus} from "../api/index";
import {changeSchedule, allSchedule, deleteSchedule} from "../api/index"
import {addSchedule, changeBus, changeRoute, allRoute} from "../api";

export default {
  name: "scheduleTable",
  setup() {
    // 可视化 相关数据
    const addVisible = ref(false);
    const editVisible = ref(false);
    // data 相关数据
    const scheduleData = ref([]);
    const routeData = ref([]);
    const routeAllData = ref([]);
    const busData = ref([]);
    const pageTotal = ref(0);
    const menu = ref([]);
    const value = ref();
    const query = reactive({
      mode: "选择查询条件",
      beginSite: "",
      endSite: "",
      busName: "",
      pageIndex: 1,
      pageSize: 10,

    });
    // 表单
    const form = reactive({
      page_num: "",
      page_size: "",
      beginSite: "",
      endsite: "",
      routeId: "",
      begintime: "",
      busid: "",
      scheduleprice: "",
    });
    // 规则校验表单
    const ruleForm = reactive({
      scheduleId: "",
      beginSite: "",
      endSite: "",
      routeId: "",
      beginTime: "",
      busId: "",
    });
    const deleteParam = reactive({
      scheduleId: "",
    })
    // 表单规则
    const ruleFormRef = ref()
    // 自定义验证规则

    const addRules = reactive({
      scheduleId: [
        {required: true, message: '请输入排班ID', trigger: 'blur'},
      ],
    })

    /** 定义方法 */

        // 获取表格数据
    const getFormData = () => {
          allSchedule(query.pageIndex, query.pageSize, query.beginSite, query.endSite, query.busName).then((res) => {
            if (res.data.code === 0) {
              scheduleData.value = res.data.data
              pageTotal.value = res.pageTotal || 10
            } else {
              ElMessage.error("查询失败" + res.data.msg)
            }
          });
        };
    //获取线路数据
    const getRouteData = () => {
      allRoute(1, 9999, "", "").then(res => {
        if (res.data.code === 0) {
          routeData.value = res.data.data
          console.log(res.data.data)
          res.data.data.forEach(data =>
              routeAllData.value.push({routeId: data.routeId, sites:(data.rBeginSite+","+data.rPathwaySite+","+data.rEndSite).split(',')})
          )
          pageTotal.value = res.pageTotal || 10
        } else {
          ElMessage.error("查询失败" + res.data.msg)
        }
      })
    };
    // 获取车辆数据
    const getBusData = () => {
      allBus(1, 9999, "").then((res) => {
        busData.value = res.data.data
        pageTotal.value = res.data.pageTotal || 10
      });
    };

    // 添加排班数据
    const addScheduleData = (data) => {
      addSchedule(beginSite, endSite, routeId, beginTime, busId, schedulePrice).then((res) => {
        console.log(res.data);
      });
    }
    // 更新排班数据
    const updateScheduleData = (data) => {
      changeSchedule(scheduleId, beginSite, endSite, routeId, beginTime, busId, schedulePrice).then((res) => {
        if (res.data.code === 0) {
          ElMessage.success("修改成功")
        } else {
          ElMessage.error("修改失败" + res.data.msg)
        }
        getFormData();
      })
    }

    // 删除排班数据
    const deleteScheduleData = (data) => {
      deleteData(data, "/schedule/deleteSchedule").then((res) => {
        console.log(res.data)
        // refresh;
      });
    }

    /**  数据加工方法  */
        // 更新stop station为数组类型
    const changeData = (data) => {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            var day = String(data[i].date);
            data[i].date = day.split(",");
          }
          return data;
        };

    /** 按钮事件  */

        // 分页导航
    const handlePageChange = (val) => {
          query.pageIndex = val;
          getFormData();
        };
    // 添加操作
    const handleAdd = () => {
      addVisible.value = true;
    }

    // 编辑操作
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
        console.log(form[item]);
      });
      editVisible.value = true;
    };

    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            deleteSchedule().scheduleId = row.scheduleId
            deleteSchedule();
            ElMessage.success("删除成功");
            allSchedule();
          })
          .catch(() => {
          });
    };

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getFormData();
    };

    // 保存新增内容
    const saveCreate = () => {
      addVisible.value = false;
      ruleForm.dateInfo = ruleForm.dateInfo.join(",")
      addScheduleData(ruleForm);
      ElMessage.success(`添加新用户成功`);
      getFormData();
    }

    // 保存编辑内容
    const saveEdit = () => {
      editVisible.value = false;
      Object.keys(form).forEach((item) => {
        scheduleData.value[idx][item] = form[item];
      });
      console.log(scheduleData.value[idx])
      updateScheduleData(scheduleData.value[idx]);
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      getFormData();
    };
    // setup时执行的函数
    getFormData();
    getRouteData();
    getRouteData();
    getBusData();

    return {
      value,
      query,
      scheduleData,
      routeData,
      busData,
      pageTotal,
      editVisible,
      addVisible,
      form,
      ruleForm,
      ruleFormRef,
      deleteParam,
      addRules,
      menu,
      routeAllData,
      handlePageChange,
      handleDelete,
      handleSearch,
      handleAdd,
      saveCreate,
      handleEdit,
      saveEdit,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
