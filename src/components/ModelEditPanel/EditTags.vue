<template>
  <div class="edit-box">
    <div class="header">
      <span> 标签配置 </span>
      <el-button type="primary" icon="Refresh" @click="onInitialize"> 重置 </el-button>
    </div>
    <!-- 标签类型列表 -->
    <div class="options">
      <div class="option">
        <el-space>
          <el-icon>
            <PriceTag />
          </el-icon>
          <span>标签类型</span>
          <span :style="{ color: '#18c174 ' }">(可拖拽添加多个)</span>
        </el-space>
      </div>
      <el-scrollbar max-height="150px">
        <el-row class="tag-row">
          <el-col
            draggable="true"
            v-for="tag in tagList"
            :key="tag.name"
            :span="4"
            @dragstart="e => onDragstart(e, tag)"
            @drag="e => onDrag(e)"
          >
            <div class="tag-box">
              <div class="icon">
                <el-icon size="16px">
                  <component :is="tag.name"></component>
                </el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 标签列表 -->
    <div class="options">
      <div class="header">标签列表</div>
    </div>
    <div class="options">
      <el-scrollbar max-height="170px" v-if="config.dragTagList.length">
        <div
          class="option"
          :class="activeTag.uuid == tag.uuid ? 'option-active' : ''"
          @click="onChooseTag(tag)"
          v-for="tag in config.dragTagList"
          :key="tag.uuid"
        >
          <div class="icon-name">
            {{ tag.innerText }}
          </div>
          <el-space>
            <div class="check" v-show="activeTag.uuid == tag.uuid">
              <el-icon size="18px" color="#2a3ff6">
                <Check />
              </el-icon>
            </div>
            <div class="icon-delete">
              <el-icon size="18px" color="#2a3ff6">
                <Delete @click.stop="onDeleteTag(tag.uuid)" />
              </el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
      <el-empty v-else description="暂无标签" :image-size="100" />
    </div>
    <!-- 标签编辑 -->
    <div class="header">
      <span> 标签编辑 </span>
    </div>
    <div class="options" v-if="activeTag.uuid">
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>容器高度</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.height" :min="1" :max="500" :step="1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>容器宽度</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.width" :min="1" :max="500" :step="1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>字体大小</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.fontSize" :min="1" :max="50" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>标签坐标X</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.positionX" :min="-50" :max="50" :step="0.01" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>标签坐标Y</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.positionY" :min="-50" :max="50" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>标签坐标Z</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.positionZ" :min="-50" :max="50" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>背景颜色</el-button>
        </div>
        <div class="grid-sidle">
          <el-color-picker
            color-format="hex"
            :predefine="predefineColors"
            @change="onChangeTagValue"
            v-model="activeTag.backgroundColor"
          />
        </div>
        <div class="grid-txt">
          <el-button type="primary" link>图标颜色</el-button>
        </div>
        <div class="grid-sidle">
          <el-color-picker
            color-format="hex"
            :predefine="predefineColors"
            @change="onChangeTagValue"
            v-model="activeTag.iconColor"
          />
        </div>
        <div class="grid-txt">
          <el-button type="primary" link>字体颜色</el-button>
        </div>
        <div class="grid-sidle">
          <el-color-picker color-format="hex" :predefine="predefineColors" @change="onChangeTagValue" v-model="activeTag.color" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>图标大小</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onChangeTagValue" show-input v-model="activeTag.iconSize" :min="1" :max="50" :step="0.1" />
        </div>
      </div>
      <div class="option" :style="{ height: 'auto' }">
        <div class="grid-txt">
          <el-button type="primary" link>标签内容</el-button>
        </div>
        <div class="grid-sidle">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            @input="onChangeTagValue"
            v-model.trim="activeTag.innerText"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, defineExpose } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
import { PREDEFINE_COLORS } from "@/config/constant";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const store = useMeshEditStore();

const predefineColors = PREDEFINE_COLORS;
const config = reactive({
  dragTagList: computed(() => store.modelApi.dragTagList)
});

const tagList = computed(() => {
  const arr = [];
  for (const [key] of Object.entries(ElementPlusIconsVue)) {
    arr.push({ name: key });
  }
  return arr;
});

const activeTag = reactive({});

// 拖拽标签开始
const onDragstart = (e, tag) => {
  store.modelApi.setDragTag(tag);
  store.changeDragType("tags");
};
// 拖拽中
const onDrag = event => {
  event.preventDefault();
};

// 重置数据
const onInitialize = () => {
  activeTag.uuid = null;
  store.modelApi.clearSceneTags();
};

//选择标签
const onChooseTag = tag => {
  Object.assign(activeTag, { ...tag });
};
// 删除标签
const onDeleteTag = uuid => {
  store.modelApi.deleteTag(uuid);
  activeTag.uuid = null;
};

// 修改标签配置
const onChangeTagValue = () => {
  store.modelApi.updateTagElement(activeTag);
};

defineExpose({ config });
</script>
<style scoped lang="scss">
.tag-row {
  font-size: 12px;
  color: #ffffff;
  cursor: all-scroll;
  .tag-box {
    box-sizing: border-box;
    padding: 5px;
    margin: 10px;
    text-align: center;
    border: 1px solid #ffffff;
  }
}
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
