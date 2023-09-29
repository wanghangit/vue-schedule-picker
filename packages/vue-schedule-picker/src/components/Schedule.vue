<template>
  <div class="calendar">
    <div class="schedule" ref="schedule" v-show="isShowSchedule" :style="{ background: rangeColor }"></div>
    <table class="calendar-table" ref="calendarTable">
      <thead class="calendar-head">
        <tr>
          <th rowspan="2" class="calendar-head-title" colspan="2">星期/时间</th>
          <th colspan="24">上午</th>
          <th colspan="24">下午</th>
        </tr>
        <tr>
          <td colspan="2" v-for="(item, index) in thead" :key="index">
            {{ item }}
          </td>
        </tr>
      </thead>
      <tbody class="calendar-body">
        <tr v-for="(day, dIndex) in timeBucketDisplay" :key="dIndex">
          <td colspan="2">
            {{ day.name }}
          </td>
          <td v-for="(selected, hIndex) in day.selectedTime" class="calendar-time-color" ref="tableItem"
            :class="{ 'active-time-color': selected }"
            :style="{ width: `${width}px`, height: `${height}px`, background: selected ? props.activeColor : 'none' }"
            :key="hIndex" :colspan="timeColSpan" @mousedown="onMouseDown($event, dIndex, hIndex)" @mousemove="onMouseMove($event, dIndex, hIndex)" @mouseup="onMouseUp($event, dIndex, hIndex)">
          </td>
        </tr>
      </tbody>
    </table>
    <!--自定义操作区-->
    <slot></slot>
    <Preview v-if="showPreview" :time-bucket-display="timeBucketDisplay" :empty-text="emptyText" :mode="mode" />
  </div>
</template>
  
<script lang="ts" setup>
import { computed, readonly, ref } from "vue";
import Preview from "./Preview.vue";
import { generateIncrementalArray, hasBit, reverseBit } from "../utils";
import { ALL_HOURS, DISPLAY_DAY_MAP, HALF_HOURS_SLOT } from '../config';
import type { ITime, IRange } from '../types';

interface ITimePickerProps {
  width?: number;
  height?: number;
  activeColor?: string;
  mode?: 'hour' | 'half-hour';
  rangeColor?: string;
  emptyText?: string;
  showPreview?: boolean;
  timeBucket: Array<ITime>;
}

const props = withDefaults(defineProps<ITimePickerProps>(), {
  width: 20,
  height: 40,
  activeColor: 'rgba(48, 130, 224, 0.6)',
  mode: 'half-hour',
  rangeColor: 'rgba(100, 255, 100, 0.5)',
  emptyText: '当前日期未选择数据',
  showPreview: true,
});

const emit = defineEmits<{
  (e: 'changeTimeBucket', index: number, value: ITime): void;
}>();

const timeSlot = computed(() => {
  return props.mode === 'hour' ? ALL_HOURS : HALF_HOURS_SLOT;
})

const timeColSpan = computed(() => {
  return props.mode === 'hour' ? 2 : 1;
})

// 生成表头的时间段0~23点
const thead = readonly(generateIncrementalArray(24));
// 选择任务
const schedule = ref();
const isShowSchedule = ref(false);
// 获取框选区域的起始点
const leftTopTime = ref();
const calendarTable = ref<HTMLElement>();

const timeBucketDisplay = computed(() => {
  return props.timeBucket.map((item, index) => {
    const { forenoon, afternoon } = item;
    const middle = timeSlot.value / 2;
    const forenoonSelected = generateIncrementalArray(middle).map((_, index) => {
      return hasBit(forenoon, index);
    });
    const afternoonSelected = generateIncrementalArray(middle).map((_, index) => {
      return hasBit(afternoon, index)
    });
    return {
      name: `星期${DISPLAY_DAY_MAP[index]}`,
      selectedTime: forenoonSelected.concat(afternoonSelected)
    }
  });
})

const onMouseUp = ($event: MouseEvent, endDIndex: number, endHIndex: number) => {
  if (!isShowSchedule.value) {
    return;
  }
  const { dIndex: startDIndex, hIndex: startHIndex } = leftTopTime.value;
  // 终点有可能小于起点所以要判断下大小
  const leftDIndex = Math.min(startDIndex, endDIndex);
  const rightDIndex = Math.max(startDIndex, endDIndex);
  const leftHIndex = Math.min(startHIndex, endHIndex);
  const rightHIndex = Math.max(startHIndex, endHIndex);
  // 从起始点到终点的一个数组遍历
  for (let i = leftDIndex; i <= rightDIndex; i++) {
    for (let j = leftHIndex; j <= rightHIndex; j++) {
      changeColor(i, j);
    }
  }
  isShowSchedule.value = false;
  schedule.value.style.width = 0;
  schedule.value.style.height = 0;
}

const onMouseMove = ($event: MouseEvent, dIndex: number, hIndex: number) => {
  $event.preventDefault();
  if (isShowSchedule.value) {
    const { clientX, clientY } = $event;
    const { x, y } = leftTopTime.value;
    schedule.value.style.width =
      `${Math.abs(clientX - leftTopTime.value.x)}px`;
    schedule.value.style.height =
      `${Math.abs(clientY - leftTopTime.value.y)}px`;
    schedule.value.style.top = `${Math.min(clientY, y)}px`;
    schedule.value.style.left = `${Math.min(clientX, x)}px`;
  }
}
const onMouseDown = ($event: MouseEvent, dIndex: number, hIndex: number) => {
  const { clientX: x, clientY: y } = $event;
  leftTopTime.value = {
    dIndex,
    hIndex,
    x,
    y
  }
  // TODO: 优化拖动距离大于多少展示
  isShowSchedule.value = true;
  schedule.value.style.left = `${x}px`;
  schedule.value.style.top = `${y}px`;
}
const changeColor = (dIndex: number, hIndex: number) => {
  const day = props.timeBucket[dIndex];
  const middle = timeSlot.value / 2;
  const newDay = { ...day }
  try {
    if (hIndex < middle) {
      newDay.forenoon = reverseBit(day.forenoon, hIndex);
    } else {
      newDay.afternoon = reverseBit(day.afternoon, hIndex - middle);
    }
  } catch (error) {
    console.log(newDay);
    console.error(error);
  }
  emit('changeTimeBucket', dIndex, newDay);
}

</script>
  
<style lang="scss" scoped>
.calendar {
  position: relative;
  margin-bottom: 10px;
  -webkit-user-select: none;
  /* and add the CSS class here instead */
  -ms-user-select: none;
  user-select: none;

  .calendar-head {
    box-sizing: border-box;

    tr,
    td {
      height: 30px;
    }
  }

  .calendar-body {
    box-sizing: border-box;
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }

  .calendar-table {
    box-sizing: border-box;
    border-collapse: collapse;
    display: table;

    thead {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
    }

    tr,
    td,
    th {
      border: 1px solid #ddd;
      font-size: 12px;
      text-align: center;
      min-width: 12px;
      padding: 0;
    }

    th,
    td {
      display: table-cell;
    }
  }

  .calendar-time-color {
    background: #f5f5f5;
    border: 1px solid #ddd;
    font-size: 12px;
    text-align: center;
    box-sizing: border-box;
    transition: background 500ms linear;
  }

  .active-time-color {
    transition: background 500ms linear;
  }
}

.schedule {
  background: rgba(100, 255, 0, .5);
  width: 0;
  height: 0;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>