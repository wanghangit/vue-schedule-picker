<template>
    <div class="container">
        <Schedule :time-bucket="data" :width="width" :height="height" :mode="mode" :active-color="activeColor"
            :range-color="rangeColor" @change-time-bucket="changeTimeBucket" />
        <div class="tool">
            <form>
                <label for="width">宽度：</label>
                <input id="width" v-model="width" type="number" />
                <label for="width">高度：</label>
                <input id="width" v-model="height" type="number" />
                <span>模式：</span>
                <input type="radio" id="half" name="mode" value="half-hour" v-model="mode" />
                <label for="half">half-hour</label>
                <input type="radio" id="hour" name="mode" value="hour" v-model="mode" />
                <label for="hour">hour</label>
                <label>选中颜色：</label>
                <input type="color" v-model="activeColor">
                <label>框选区颜色：</label>
                <input type="color" v-model="rangeColor">
            </form>
        </div>
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
import Schedule, { generateSelectedTime, DISPLAY_DAY_MAP } from '../src/index';

const data = ref(generateSelectedTime());
const width = ref(20);
const height = ref(40);
const mode = ref<'half-hour' | 'hour'>('half-hour');
const activeColor = ref('rgba(100, 255, 100, 0.5)');
const rangeColor = ref('rgba(48, 130, 224, 0.6)');

const changeTimeBucket = (index: number, value: ITime) => {
    data.value[index] = value;
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