<template>
  <div class="container">
    <Schedule :time-bucket="data" :width="width" :height="height" :mode="mode" :active-color="activeColor"
      :range-color="rangeColor" :show-preview="showPreview" :language="language" @change-time-bucket="changeTimeBucket">
      <div style="margin-top: 10px;">
        <ElButton @click="reset">reset</ElButton>
        <div class="tool">
          <form>
            <label>width：</label>
            <el-input-number v-model="width" :min="12" :max="40" />
            <label>height：</label>
            <el-input-number v-model="height" :min="12" :max="40" />
            <label>mode：</label>
            <el-radio-group v-model="mode" class="ml-4">
              <el-radio label="half-hour">half-hour</el-radio>
              <el-radio label="hour">hour</el-radio>
            </el-radio-group>
            <label>activeColor：</label>
            <el-color-picker v-model="activeColor" :show-alpha="true" />
            <label>rangeColor：</label>
            <el-color-picker v-model="rangeColor" :show-alpha="true" />
            <label>showPreview：</label>
            <el-radio-group v-model="showPreview" class="ml-4">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
            <label>language：</label>
            <el-radio-group v-model="language" class="ml-4">
              <el-radio :label="'zh-cn'">zh-cn</el-radio>
              <el-radio :label="'en-us'">en-us</el-radio>
            </el-radio-group>
          </form>
        </div>
      </div>
    </Schedule>
    <div class="preview">
      <ElText>Real time Data：</ElText>
      <ElTable :data="data">
        <ElTableColumn label="DayTime">
          <template #default="{ $index }">
            {{ config['DISPLAY_DAY_MAP'][$index] }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="forenoon" label="Forenoon" />
        <ElTableColumn prop="afternoon" label="Afternoon" />
      </ElTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ElButton, ElInputNumber, ElRadioGroup, ElRadio, ElColorPicker, ElTable, ElTableColumn, ElText } from 'element-plus';
import Schedule, { generateSelectedTime, getLanguageConfig } from '../../vue-schedule-picker/src/index';
import type { ITime } from '../../vue-schedule-picker/src/index';

const data = ref(generateSelectedTime());
const width = ref(20);
const height = ref(40);
const mode = ref<'half-hour' | 'hour'>('half-hour');
const activeColor = ref('rgba(100, 255, 100, 0.5)');
const rangeColor = ref('rgba(48, 130, 224, 0.6)');
const showPreview = ref(true);
const language = ref<'zh-cn' | 'en-us'>('zh-cn');

const changeTimeBucket = (index: number, value: ITime) => {
  data.value[index] = value;
}

const reset = () => {
  data.value = generateSelectedTime();
}

const config = computed(() => {
  return getLanguageConfig(language.value);
})
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
  background-color: #f0f0f0;
  padding: 10px;
  box-sizing: border-box;
}

.preview{
  margin-bottom: 10px;
}

* {
  margin: 0;
}
</style>..