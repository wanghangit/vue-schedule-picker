<template>
  <div class="container">
    <Schedule :time-bucket="data" :width="width" :height="height" :mode="mode" :active-color="activeColor"
      :range-color="rangeColor" :show-preview="showPreview" @change-time-bucket="changeTimeBucket">
      <div style="margin-top: 10px;">
        <ElButton @click="reset">重置</ElButton>
        <div class="tool">
          <form>
            <label>宽度：</label>
            <el-input-number v-model="width" :min="12" :max="40" />
            <label>高度：</label>
            <el-input-number v-model="height" :min="12" :max="40" />
            <label>模式：</label>
            <el-radio-group v-model="mode" class="ml-4">
              <el-radio label="half-hour" size="large">half-hour</el-radio>
              <el-radio label="hour" size="large">hour</el-radio>
            </el-radio-group>
            <label>选中颜色：</label>
            <el-color-picker v-model="activeColor" :show-alpha="true" />
            <label>框选区颜色：</label>
            <el-color-picker v-model="rangeColor" :show-alpha="true" />
            <label>是否开启预览：</label>
            <el-radio-group v-model="showPreview" class="ml-4">
              <el-radio :label="true" size="large">true</el-radio>
              <el-radio :label="false" size="large">false</el-radio>
            </el-radio-group>
          </form>
        </div>
      </div>
    </Schedule>
    <div class="preview">
      <p>实时数据：</p>
      <div v-for="(item, index) in data">
        <span>星期{{ DISPLAY_DAY_MAP[index] }}</span>
        <span>上午：{{ item.forenoon }}</span>
        <span>下午：{{ item.afternoon }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElButton, ElInputNumber, ElRadioGroup, ElRadio, ElColorPicker } from 'element-plus';
import Schedule, { generateSelectedTime, DISPLAY_DAY_MAP } from '../../vue-schedule-picker/src/index';
import type { ITime } from '../../vue-schedule-picker/src/index';

const data = ref(generateSelectedTime());
const width = ref(20);
const height = ref(40);
const mode = ref<'half-hour' | 'hour'>('half-hour');
const activeColor = ref('rgba(100, 255, 100, 0.5)');
const rangeColor = ref('rgba(48, 130, 224, 0.6)');
const showPreview = ref(true);

const changeTimeBucket = (index: number, value: ITime) => {
  data.value[index] = value;
}

const reset = () => {
  data.value = generateSelectedTime();
}
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  padding: 10px;
  box-sizing: border-box;
}

* {
  margin: 0;
}
</style>..