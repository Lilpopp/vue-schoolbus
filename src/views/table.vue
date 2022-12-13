<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户信息管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="userId" label="用户id"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="avatar" label="性别"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              修改用户信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.avatar"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="basetable">
import {ref, reactive} from 'vue';
import {ElMessage} from 'element-plus';
import {Edit} from '@element-plus/icons-vue';
import {findUser, userChange} from '../api/index';

const query = reactive({
  sex: '',
  name: '',
  pageIndex: 1,
  pageSize: 10
});
const tableData = ref([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  findUser(query.pageIndex, query.pageSize, "").then(res => {
    if (res.data.code === 0) {
      tableData.value = res.data.data
      pageTotal.value = res.data.pageTotal || 50
      ElMessage.success(res.data.msg);
    } else {
      ElMessage.error(res.data.msg);
    }
  })
};
getData();

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  query.pageIndex = val;
  getData();
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  phone: '',
  sex: ''
});
let idx = -1;
const handleEdit = (index, row) => {
  idx = index;
  form.phone = row.phone;
  form.avatar = row.avatar;
  editVisible.value = true;
};
const saveEdit = () => {
  userChange("", form.avatar, form.phone, "").then(res => {
    if (res.data.code === 0) {
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      if (form.phone !== "") {
        tableData.value[idx].phone = form.phone;
      }
      if (form.sex !== "") {
        tableData.value[idx].avatar = form.avatar;
      }
    } else {
      ElMessage.success(`修改失败` + res.data.msg);
    }
    editVisible.value = false;
  })
};
</script>
