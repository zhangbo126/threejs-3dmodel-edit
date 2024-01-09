<template>
	<div class="iframe-box">
		<tree-component />
	</div>
</template>
<script setup lang="jsx" name="modelBase">
import { useRouter } from "vue-router";
import { ref } from 'vue'
import createThreeDComponent from "@/utils/initThreeTemplate";
import { ElMessageBox } from 'element-plus'
const router = useRouter();
const config = ref(null)

//获取URL参数
const modelConfig = window.location.href.split('?modelConfig=')[1]

if (modelConfig) {
	const configStr = decodeURIComponent(modelConfig).replace(/'/g, '"')
	config.value = JSON.parse(configStr)
} else {
	ElMessageBox.alert(`当前页面出错,返回首页`, '提示', {
		confirmButtonText: '确认',
		type: 'warning'
	}).then(() => {
		router.push({ path: '/' })
	})
}

const treeComponent = createThreeDComponent(config.value);
</script>
<style lang="scss" scoped>
.iframe-box {
	width:100%;
	height:100%;
}
</style>
  