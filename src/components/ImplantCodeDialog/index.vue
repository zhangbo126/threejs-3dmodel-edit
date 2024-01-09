<template>
	<el-dialog v-model="visible" title="嵌入网站" width="600px" :close-on-click-modal="false">
		<el-scrollbar max-height="510px">
			<code class="code">{{ codeString }}</code>
		</el-scrollbar>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" class="copy-button" @click="onCopyCode">
					复制代码
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup>

import { ElMessage } from "element-plus";
import { defineExpose, ref } from 'vue'
import Clipboard from 'clipboard';
import { IFRAME_PREVIEW } from '@/config/constant'
const visible = ref(false)
const codeString = ref(null)

const showDialog = (code) => {
	visible.value = true
	const src = `${IFRAME_PREVIEW}?` + 'modelConfig=' + code
	const iframe = `<iframe  src="${src}" allowfullscreen></iframe>`;
	codeString.value = iframe
}

const onCopyCode = () => {
	const clipboard = new Clipboard('.copy-button', { text: () => codeString.value });
	clipboard.on('success', () => {
		ElMessage.success('复制成功')
		clipboard.destroy();
	});
	clipboard.on('error', () => {
		console.log('复制失败');
		clipboard.destroy();
	});
}

defineExpose({ showDialog })
</script>


<style lang="scss" scoped>
.code {
	display: block;
	background-color: #f9f9f9;
	padding: 10px;
	font-family: Consolas, monospace;
	color: #333;
	word-wrap: break-word;

}
</style>