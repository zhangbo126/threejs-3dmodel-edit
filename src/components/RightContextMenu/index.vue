<script lang="jsx">
import { defineComponent, h } from "vue";
export default defineComponent({
  props: {
    rightMenuPositon: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      display: "none",
      modelKey: null,
    };
  },
  watch: {
    rightMenuPositon: {
      handler(val) {
        const { x, y, modelKey } = val;
        const { innerWidth, innerHeight } = window;
        this.mouseX = x + 100 > innerWidth ? innerWidth - 100 : x;
        this.mouseY = y + 28 > innerHeight ? innerHeight - 28 : y;
        this.display = "block";
        this.modelKey = modelKey;
        document.addEventListener("mouseup", this.onMouseup, false);
      },
      deep: true,
    },
  },
  methods: {
    onDelete() {
      this.$emit("onDelete", this.modelKey);
    },
    onMouseup(e) {
      // 0是左键、1是滚轮按钮或中间按钮（若有）、2鼠标右键
      if (e.button === 0) {
        this.display = "none";
        document.removeEventListener("mouseup", this.onMouseup);
      }
    },
  },
  render() {
    return h(
      <ul
        class="right-menu"
        style={{
          top: this.mouseY + "px",
          left: this.mouseX + "px",
          display: this.display,
        }}
      >
        <li class="right-menu-item" onClick={this.onDelete}>
          <el-space>
            <el-icon size={14} color={"#6bacf2"}>
              <delete></delete>
            </el-icon>
            <el-text type="primary" >
              删除
            </el-text>
          </el-space>
        </li>
      </ul>
    );
  },
});
</script>
<style lang="scss" scoped>
.right-menu {
  background-color: #fff;
  border-radius: 4px;
  list-style-type: none;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  font-size: 12px;
  font-weight: 500;
  box-sizing: border-box;
  padding: 4px 0;
  position: fixed;
  display: none;
  z-index: 1000;

  .right-menu-item {
    box-sizing: border-box;
    border-radius: 4px;
    transition: all 0.36s;
    cursor: pointer;
    width: 100px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 8px;
  }

  .right-menu-item:hover {
    background-color: #ebf5ff;
    color: #6bacf2;
  }
}
</style>
