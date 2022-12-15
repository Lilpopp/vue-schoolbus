<template>
  <div>
    <!-- 小页面标题 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 预约情况
        </el-breadcrumb-item>

      </el-breadcrumb>
    </div>
    <!-- 排班表单 -->
    <div class="container">
      <!-- 排班表单 -->
      <el-table :data="scheduleData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column id="scheduleId" prop="scheduleId" label="排班ID" align="center"></el-table-column>
        <el-table-column id="beginSite" prop="beginSite" label="始发站" align="center"></el-table-column>
        <el-table-column prop="endSite" label="终点站" align="center"></el-table-column>
        <el-table-column prop="schedulePrice" label="价格" align="center"></el-table-column>
        <el-table-column prop="beginTime" label="发车时间" align="center"></el-table-column>
        <el-table-column prop="busId" label="车辆ID" align="center"></el-table-column>
        <el-table-column prop="busName" label="车辆名称" align="center"></el-table-column>
        <el-table-column prop="busAllNum" label="可搭载人数" align="center"></el-table-column>
        <el-table-column prop="busNum" label="当前预约人数" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="是否已经支付" align="center"></el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.orderStatus === '未支付'" type="text" icon="el-icon-edit" @click="paySchedule(scope.$index, scope.row)">支付
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除
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
  </div>
</template>


<script>
import {ref, reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {allOrder, deleteOrder, payOrder} from "../api/index";

export default {
  name: "scheduleTable",
  setup() {
    // data 相关数据
    const scheduleData = ref([]);
    const pageTotal = ref(0);
    const menu = ref([]);
    const value = ref();
    // request 相关数据
    const query = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
    const deleteParam = reactive({
      scheduleId: "",
    })
    /** 定义方法 */
        // 获取表格数据
    const getFormData = () => {
          allOrder(query.pageIndex, query.pageSize).then(res => {
            if (res.data.code === 0) {
              scheduleData.value = res.data.data;
              pageTotal.value = ( res.data.pageTotal * query.pageSize ) || 10
            } else {
              ElMessage.error("查询失败" + res.data.msg)
            }
          })
        };
    // 删除排班数据
    const deleteScheduleData = (data) => {
      deleteOrder(data.orderId).then(res => {
        if (res.data.code === 0) {
          ElMessage.success("删除成功")
        } else {
          ElMessage.error("删除失败" + res.data.msg)
        }
      })
    }
    const pay = (data) => {
      payOrder(data.orderId).then(res => {
        if (res.data.code === 0) {
          ElMessage.success("支付成功")
        } else {
          ElMessage.error("支付失败" + res.data.msg)
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
    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            deleteParam.orderId = row.orderId
            deleteScheduleData(deleteParam);
            getFormData();
          })
          .catch(() => {
          });
    };
    const paySchedule = (index, row) => {
      ElMessageBox.confirm("确认支付吗？", "提示", {
        type: "info",
      })
          .then(() => {
            deleteParam.orderId = row.orderId
            pay(deleteParam);
          })
          .catch(() => {
          });
    }
    // setup时执行的函数
    getFormData();
    return {
      value,
      query,
      scheduleData,
      pageTotal,
      deleteParam,
      menu,
      handlePageChange,
      handleDelete,
      paySchedule,
    };
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>