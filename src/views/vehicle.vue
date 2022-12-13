<template>
  <div>
    <!-- 小页面标题 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 校车信息管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 校车表单 -->
    <div class="container">
      <!-- 标题工具栏 -->
      <div class="handle-box">
        <el-input v-model="query.busName" placeholder="校车名称" class="handle-input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加校车</el-button>
      </div>
      <!-- 校车表单 -->
      <el-table :data="busData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="busId" label="校车ID" align="center"></el-table-column>
        <el-table-column prop="busName" label="校车名称" align="center"></el-table-column>
        <el-table-column prop="busAllNum" label="可搭载人数" align="center"></el-table-column>
        <el-table-column prop="busNum" label="当前人数" align="center"></el-table-column>
        <el-table-column prop="busState" label="当前状态" align="center"></el-table-column>
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

    <!-- 编辑弹出框 无校验 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="校车ID：">
          <el-input v-model="form.busId" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="可搭载人数：">
          <el-input v-model="form.busAllNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="当前人数：">
          <el-input v-model="form.busNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="当前状态：">
          <el-input v-model="form.busState" placeholder=""></el-input>
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
    <el-dialog title="添加校车" v-model="addVisible" width="30%">
      <el-form :model="ruleForm" ref="ruleFormRef" :rules="addRules" label-width="100px">
        <!-- <el-form rules="rules" label-width="70px"> -->
        <el-form-item label="校车名称：" prop="busName">
          <el-input v-model="ruleForm.busName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="搭载人数：" prop="busAllNum">
          <el-input v-model="ruleForm.busAllNum" placeholder=""></el-input>
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
import {
  getDataNoParam,
  getDataParam,
  insertData,
  deleteData,
  updateData,
  allBus,
  addBus,
  deleteBus, changeBus
} from "../api/index";

export default {
  name: "busTable",
  setup() {
    // 可视化 相关数据
    const addVisible = ref(false);
    const editVisible = ref(false);
    // data 相关数据
    const busData = ref([]);
    const pageTotal = ref(0);
    const menu = ref([]);
    // 设定行列的初值
    const row = ref(4);
    const column = ref(9);
    // request 相关数据
    const query = reactive({
      busName: "",
      pageIndex: 1,
      pageSize: 10,
    });
    // 表单
    const form = reactive({
      busId: "",
      busName: "",
      busAllNum: "",
      busNum: "",
      busState: "",
    });
    // 规则校验表单
    const ruleForm = reactive({
      busId: "",
      busName: "",
      busAllNum: ""
    });

    const deleteParam = reactive({
      busId: "",
    })

    // 表单规则
    const ruleFormRef = ref()

    const addRules = reactive({
      busName: [
        {required: true, message: '请输入校车名称！', trigger: 'blur'},
        {min: 2, max: 20, message: '名称长度应介于2到20之间', trigger: 'blur'},
        {type: 'string', message: '请输入汉字！', trigger: 'blur'},
      ],
      busAllNum: [
        {required: true, message: '请输入校车可搭载人数！', trigger: 'blur'},
        {"pattern": /^[0-9]*$/, "message": "只能输入正整数"}
      ]
    })

    /** 定义方法 */

        // 获取表格数据
    const getFormData = () => {
          allBus(query.pageIndex, query.pageSize, query.busName).then((res) => {
            console.log(res)
            busData.value = res.data.data
            pageTotal.value = res.data.pageTotal || 10
          });
        };

    // 更新校车数据
    const updateBusData = (data) => {
      console.log(data.busState)
      changeBus(data.busId, data.busName, data.busState, data.busAllNum, data.busNum).then(res => {
        if(res.data.code === 0){
          ElMessage.success("修改成功")
        }else{
          ElMessage.error("修改失败"+res.data.msg)
        }
        getFormData();
      })
    }

    // 删除校车数据
    const deleteBusData = (data) => {
      deleteBus(data.busId).then(res => {
        if (res.data.code === 0) {
          ElMessage.success("删除成功")
        } else {
          ElMessage.error("删除失败" + res.data.msg)
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
            deleteParam.busId = row.busId
            deleteBusData(deleteParam);
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
      addBus(ruleForm.busName, ruleForm.busAllNum).then(res => {
        if (res.data.code === 0) {
          ElMessage.success("添加成功")
        } else {
          ElMessage.error("添加失败" + res.data.msg)
        }
        getFormData();
      })
    }

    // 保存编辑内容
    const saveEdit = () => {
      editVisible.value = false;
      Object.keys(form).forEach((item) => {
        busData.value[idx][item] = form[item];
      });
      updateBusData(busData.value[idx]);
    };
    // setup时执行的函数
    getFormData();

    return {
      query,
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
      row,
      column,
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

.handle-input {
  width: 200px;
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