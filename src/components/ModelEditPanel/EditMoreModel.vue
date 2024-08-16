<template>
  <div class="edit-box">
    <div class="header">
      <span> 多模型列表 </span>
    </div>
    <div class="options">
      <el-scrollbar height="200px">
        <div
          class="option"
          :class="chooseModelUuid == item.uuid ? 'option-active' : ''"
          @click="onChangeManyModel(item)"
          v-for="item in manyModelList"
          :key="item.uuid"
        >
          <div class="icon-name">
            {{ item.name }}
          </div>
          <el-space>
            <div class="check" v-show="chooseModelUuid == item.uuid">
              <el-icon size="20px" color="#2a3ff6">
                <Check />
              </el-icon>
            </div>
            <div class="icon-delete">
              <el-icon size="18px" color="#2a3ff6">
                <Delete @click.stop="onDeleteManyModel(item.uuid)" />
              </el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
    </div>
    <div class="header">
      <span>模型编辑</span>
    </div>
    <div class="options" v-show="chooseModelUuid">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Location />
          </el-icon>
          <span> 模型位置 </span>
        </el-space>
        <el-button type="primary" link icon="Refresh" @click="onResultModelPosition"> 重置 </el-button>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>X 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @input="onSetModelPosition" show-input v-model="config.position.x" :min="-10" :max="10" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Y 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @input="onSetModelPosition" show-input v-model="config.position.y" :min="-10" :max="10" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Z 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @input="onSetModelPosition" show-input v-model="config.position.z" :min="-10" :max="10" :step="0.1" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
import { ElMessage } from "element-plus";

const store = useMeshEditStore();
// 当前选择的模型
const chooseModelUuid = ref(null);

const config = reactive({
  position: {
    x: 0,
    y: 0,
    z: 0
  }
});

const manyModelList = computed(() => {
  const manyModelGroup = store.modelApi.manyModelGroup;
  const manyList = manyModelGroup.children.map(v => {
    // console.log(v, "================");
    return {
      name: v.name,
      uuid: v.uuid
    };
  });
  return manyList;
});

// 选择模型
const onChangeManyModel = item => {
  chooseModelUuid.value = item.uuid;
  const { position } = store.modelApi.chooseManyModel(item.uuid);
  Object.assign(config, {
    position
  });
};
// 删除模型
const onDeleteManyModel = () => {};

// 修改模型位置
const onSetModelPosition = () => {};

//重置当前模型位置
const onResultModelPosition = () => {
  Object.assign(config, {
    position: {
    x: 0,
    y: 0,
    z: 0
  }
  });
};
</script>
<style scoped lang="scss">
.icon-name {
  width: 240px;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.option {
  justify-content: space-between;
}
.grid-txt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
