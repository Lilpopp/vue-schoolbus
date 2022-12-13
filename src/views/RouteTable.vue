<template>
  <div>
    <!-- 小页面标题 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 路径管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 排班表单 -->
    <div class="container">
      <!-- 标题工具栏 -->
      <div class="handle-box">
        <el-select v-model="query.mode" placeholder="查询模式" class="handle-select mr10">
          <el-option key="1" label="始发站查询" value="beginSiteMode"></el-option>
          <el-option key="2" label="终点站查询" value="endSiteMode"></el-option>
        </el-select>
        <el-input v-if="query.mode == 'beginSiteMode'" v-model="query.beginSite" placeholder="始发站"
                  class="handle-input"></el-input>
        <el-input v-if="query.mode == 'endSiteMode'" v-model="query.endSite" placeholder="终点站"
                  class="handle-input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加线路</el-button>
      </div>
      <!-- 排班表单 -->
      <el-table :data="scheduleData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="routeId" label="路线ID" align="center"></el-table-column>
        <el-table-column prop="rBeginSite" label="始发站" align="center"></el-table-column>
        <el-table-column prop="rEndSite" label="终点站" align="center"></el-table-column>
        <el-table-column prop="rPathwaySite" label="途径站" align="center"></el-table-column>
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

    <!-- 编辑弹出框 无校验 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="始发站：">
          <el-input v-model="form.rBeginSite" prop="beginSite" placeholder="始发站" class="handle-select mr10"/>
        </el-form-item>
        <el-form-item label="终点站：">
          <el-input v-model="form.rEndSite" prop="endSite" placeholder="终点站" class="handle-select mr10"/>
        </el-form-item>
        <el-form-item label="途径站：">
          <el-input v-model="form.rPathwaySite" prop="pathwaySite" placeholder="途径站(用逗号隔开)"
                    class="handle-select mr10"/>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>

    <!-- 添加弹出框 有校验 -->
    <el-dialog title="添加排班" v-model="addVisible" width="30%">
      <el-form :model="ruleForm" ref="ruleFormRef" :rules="addRules" label-width="100px">
        <el-form-item label="始发站：">
          <el-input v-model="ruleForm.beginSite" prop="beginSite" placeholder="始发站" class="handle-select mr10"/>
        </el-form-item>
        <el-form-item label="终点站：">
          <el-input v-model="ruleForm.endSite" prop="endSite" placeholder="终点站" class="handle-select mr10"/>
        </el-form-item>
        <el-form-item label="途径站：">
          <el-input v-model="ruleForm.pathwaySite" prop="pathwaySite" placeholder="途径站(用逗号隔开)"
                    class="handle-select mr10"/>
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
import {getDataParam, insertData, deleteData, updateData} from "../api/index";
import {addRoute, changeRoute, deleteRoute, allRoute} from "../api/index";

export default {
  name: "scheduleTable",
  setup() {
    // 可视化 相关数据
    const addVisible = ref(false);
    const editVisible = ref(false);
    // data 相关数据
    const scheduleData = ref([]);
    const routeData = ref([]);
    const pageTotal = ref(0);
    const menu = ref([]);
    const value = ref();
    // request 相关数据
    const path = "/schedule/querySchedule";
    const query = reactive({
      mode: "",
      beginSite: "",
      endSite: "",
      pageIndex: 1,
      pageSize: 10,

    });
    // 表单
    const form = reactive({
      routeId: "",
      rBeginSite: "",
      rEndSite: "",
      rPathwaySite: "",
    });
    // 规则校验表单
    const ruleForm = reactive({
      routeId: "",
      beginSite: "",
      endSite: "",
      pathwaySite: "",
    });
    const deleteParam = reactive({
      scheduleId: "",
    })
    // 表单规则
    const ruleFormRef = ref()
    // 自定义验证规则

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

    /** 定义方法 */

        // 获取表格数据
    const getFormData = () => {
          allRoute(query.pageIndex, query.pageSize, query.beginSite, query.endSite).then(res => {
            if (res.data.code === 0) {
              scheduleData.value = res.data.data;
              pageTotal.value = res.data.pageTotal || 10;
            } else {
              ElMessage.error("获取失败" + res.data.msg)
            }
          })
        };

    // 添加排班数据
    const addScheduleData = (data) => {
      insertData(data, "/schedule/createSchedule").then((res) => {
        console.log(res.data);
      });
    }
    // 更新排班数据
    const updateScheduleData = (data) => {
      changeRoute(data.routeId, data.rBeginSite, data.rEndSite, data.rPathwaySite).then(res => {
        if(res.data.code === 0){
          ElMessage.success("修改成功")
        }else{
          ElMessage.error("修改失败"+res.data.msg)
        }
      })

    }

    // 删除排班数据
    const deleteScheduleData = (data) => {
      deleteRoute(data.routeId).then(res => {
        if(res.data.code === 0){
          ElMessage.error("删除成功")
        }else{
          ElMessage.error("删除失败"+res.data.msg)
        }
        getFormData();
      })
    }
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
            deleteParam.routeId = row.routeId
            deleteScheduleData(deleteParam);
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
      addRoute(ruleForm.beginSite, ruleForm.endSite, ruleForm.pathwaySite).then(res => {
        if (res.data.code === 0) {
          ElMessage.success("添加成功")
        } else {
          ElMessage.error("添加失败" + res.data.msg)
        }
        addVisible.value = false;
        getFormData();
      })
    }

    // 保存编辑内容
    const saveEdit = () => {
      editVisible.value = false;
      Object.keys(form).forEach((item) => {
        scheduleData.value[idx][item] = form[item];
      });
      updateScheduleData(scheduleData.value[idx]);
      getFormData();
    };
    // setup时执行的函数
    getFormData();

    return {
      value,
      query,
      scheduleData,
      routeData,
      pageTotal,
      editVisible,
      addVisible,
      form,
      ruleForm,
      ruleFormRef,
      deleteParam,
      addRules,
      menu,
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

