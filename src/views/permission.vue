<template>
	<div class="container">
		<div class="plugins-tips">通过 v-permiss 自定义指令实现权限管理，使用非 admin 账号登录，可查看效果。</div>
		<div class="mgb20">
			<span class="label">角色：</span>
			<el-select v-model="role" @change="handleChange">
				<el-option label="管理员" value="admin"></el-option>
				<el-option label="普通用户" value="user"></el-option>
			</el-select>
		</div>
		<div class="mgb20 tree-wrapper">
			<el-tree
				ref="tree"
				:data="data"
				node-key="id"
				default-expand-all
				show-checkbox
				:default-checked-keys="checkedKeys"
			/>
		</div>
		<el-button type="primary" @click="onSubmit">保存权限</el-button>
	</div>
</template>

<script setup  name="permission">
import { ref } from 'vue';
import { ElTree } from 'element-plus';
import { usePermissStore } from '../store/permiss';

const role = ref('admin');


const data = [
	{
		id: '1',
		label: '系统首页'
	},
  {
    id:'2',
    label:'用户管理'
  },
  {
    id: '3',
    label:'预约'
  },

	{
		id: '4',
		label: '用户管理',
		children: [
			{
				id: '5',
				label: '车辆管理'
			},
			{
				id: '6',
				label: '路径管理'
			},
      {
        id: '7',
        label: '车辆运行信息'
      }
		]
	},

  {
    id: '8',
    label: '订单信息管理',
  },
			{
				id: '9',
				label: '权限管理',
			},]

const permiss = usePermissStore();

// 获取当前权限
const checkedKeys = ref([]);
const getPremission = () => {
	// 请求接口返回权限
	checkedKeys.value = permiss.defaultList[role.value];
};
getPremission();

// 保存权限
const tree = ref();
const onSubmit = () => {
	// 获取选中的权限
	console.log(tree.value.getCheckedKeys(false));
};

const handleChange = (val) => {
	tree.value.setCheckedKeys(permiss.defaultList[role.value]);
};
</script>

<style scoped>
.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
}
</style>
