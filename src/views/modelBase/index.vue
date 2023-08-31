<template>
  <div class="model-base">
    <!-- 头部区域 -->
    <header class="base-header">
      <div class="lf-box"></div>
      <div class="center-box">
        <el-space>
          <el-icon>
            <ElementPlus />
          </el-icon>
          <p>3d模型库</p>
        </el-space>
      </div>
      <div class="lr-box"></div>
    </header>
    <!-- 内容区 -->
    <div class="base-container">
      <el-scrollbar :max-height="'calc(100vh - 45px)'" class="base-menu">
        <ul >
          <draggable class="menu-list" :list="modelList" item-key="id"
          v-model="modelList" draggable=".model-image">
            <transition-group>
              <li v-for="model in modelList" :key="model.id">
                <div class="model-image">
                  <el-image fit="scale-down" :src="model.icon"></el-image>
                </div>
                <div class="model-info">
                  <div class="model-name">
                    <el-tooltip effect="dark" :content="model.name" placement="top">
                      <span>{{ model.name }}</span>
                    </el-tooltip>
                  </div>
                  <div class="model-time">
                    2023-8-23
                  </div>
                </div>
              </li>
            </transition-group>
          </draggable>
        </ul>
      </el-scrollbar>
      <div class="drag-content">
        <div class="content">

        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import draggable from 'vuedraggable'
import { modelList } from "@/config/model.js";

</script>
<style scoped lang="scss">
.model-base {
  .base-header {
    height: 45px;
    width: 100%;
    background-color: #010c1d;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    font-weight: 500;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    box-sizing: border-box;

    .center-box {
      display: flex;
      align-items: center;
      font-size: 22px;
    }
  }

  .base-container {
    display: flex;

    .base-menu {
      height: calc(100vh - 45px);
      width: 230px;
      padding: 10px 10px;
      box-sizing: border-box;
      background-color: #18181c;

      .menu-list {
        li {
          border-radius: 3px;
          font-size: 14px;
          margin-bottom: 10px;
          color: #fff;
          box-sizing: border-box;
          cursor: all-scroll;

          &:hover {
            border: 2px solid #18c174;

          }

          .model-image {
            font-size: 0;
            padding: 10px 18px;
          }

          .model-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30px;
            padding: 0px 8px;
            box-sizing: border-box;
            background-color: #232324;

            .model-name {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              width: 80px;
            }
          }
        }
      }
    }

    .drag-content {
      height: calc(100vh - 45px);
      box-sizing: border-box;
      display: flex;
      flex-flow: row;
      width: 100%;
      border-left: 5px solid #000000;

      .content {
        width: 100%;
        background-color: #18181c;
        background-size: 15px 15px, 15px 15px;
        background-image: linear-gradient(#18181c 14px, transparent 0), linear-gradient(90deg, transparent 14px, #86909c 0);
      }
    }
  }
}
</style>
