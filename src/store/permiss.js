import { defineStore } from 'pinia';

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : [],
			defaultList:{
				admin: ['1', '2', '3', '4', '5', '6', '7', '8',/*9是一个权限管理页面，添加*/],
				user: ['1', '3','7'],
			}
		};
	},
	actions: {
		handleSet(val) {
			this.key = val;
		}
	}
});
