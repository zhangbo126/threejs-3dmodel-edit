<template>
  <div class="edit-box">
    <div class="header">
      <span> 多模型列表 </span>
    </div>
    <div class="options">
      <el-scrollbar height="200px">
        <template v-if="manyModelList.length">
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
              <div class="icon-delete" v-show="chooseModelUuid == item.uuid">
                <el-icon size="18px" color="#2a3ff6">
                  <Delete @click.stop="onDeleteManyModel(item.uuid)" />
                </el-icon>
              </div>
            </el-space>
          </div>
        </template>
        <el-empty v-else description="切换多模型“场景”拖拽添加模型" :image-size="100" />
      </el-scrollbar>
    </div>
    <div class="header">
      <span>模型编辑</span>
    </div>
    <div class="options" v-show="chooseModelUuid">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Setting />
          </el-icon>
          <span> 模型轴旋转 </span>
        </el-space>
        <el-button type="primary" link icon="Refresh" @click="onResultModelRotate"> 重置 </el-button>
      </div>
      <div class="option">
        <el-space>
          <el-button type="info" icon="RefreshRight" @click="onSetManyModelRotation('x', 'right')" />
          <el-button type="primary" link>X轴</el-button>
          <el-button type="info" icon="RefreshLeft" @click="onSetManyModelRotation('x', 'left')" />
        </el-space>
        <el-space>
          <el-button type="info" icon="RefreshRight" @click="onSetManyModelRotation('y', 'right')" />
          <el-button type="primary" link>Y轴</el-button>
          <el-button type="info" icon="RefreshLeft" @click="onSetManyModelRotation('y', 'left')" />
        </el-space>
        <el-space>
          <el-button type="info" icon="RefreshRight" @click="onSetManyModelRotation('z', 'right')" />
          <el-button type="primary" link>Z轴</el-button>
          <el-button type="info" icon="RefreshLeft" @click="onSetManyModelRotation('z', 'left')" />
        </el-space>
      </div>
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
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
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
const onDeleteManyModel = () => {
  store.modelApi.deleteManyModel(chooseModelUuid.value);
  ElMessage.success("删除成功");
  chooseModelUuid.value = null;
};

// 设置模型轴位置
const onSetManyModelRotation = (type, direction) => {
  const flag = direction == "right" ? true : false;
  store.modelApi.setManyModelRotation(type, flag, chooseModelUuid.value);
};

//重置模型轴配置
const onResultModelRotate = () => {
  store.modelApi.initManyModelRotation(chooseModelUuid.value);
};

// 修改模型位置
const onSetModelPosition = () => {
  store.modelApi.setManyModelPosition(config.position, chooseModelUuid.value);
};

//重置当前模型位置
const onResultModelPosition = () => {
  const initPosition = store.modelApi.initManyModelPosition(chooseModelUuid.value);
  Object.assign(config, {
    position: initPosition
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
