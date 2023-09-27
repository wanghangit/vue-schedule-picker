<template>
  <div class="calendar">
    <div class="schedule" ref="schedule" v-show="isShowSchedule" :style="{ background: props.rangeColor }"></div>
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
          <td colspan="2" onselectstart="return false" ondragstart="return false">
            {{ day.name }}
          </td>
          <td v-for="(selected, hIndex) in day.selectedTime" class="calendar-time-color"
            :class="{ 'active-time-color': selected }"
            :style="{ width: `${width}px`, height: `${height}px`, background: selected ? props.activeColor : 'none' }"
            :key="hIndex" :colspan="timeColSpan">
          </td>
        </tr>
      </tbody>
    </table>
    <div class="calendar-preview">
      <div v-for="day in timeBucketPreview" class="day-item">
        <span class="day-name">{{ day.name }}</span>
        <div class="day-selectedTime" v-for="time in day.selectedTime">
          <span>{{ time }}</span>
        </div>
        <div class="day-no-selected" v-show="!day.selectedTime.length">{{ props.emptyText }}</div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, readonly, ref, watch, nextTick } from "vue";
import { generateIncrementalArray, getEndIndexFromPosition, getStartIndexFromPosition, generatePreviewTime } from "../utils";
import { ALL_HOURS, DISPLAY_DAY_MAP, HALF_HOURS_SLOT } from '../config';

interface ITimePickerProps {
  width?: number;
  height?: number;
  activeColor?: string;
  mode?: 'hour' | 'half-hour';
  rangeColor?: string;
  emptyText?: string
  timeBucket: Array<ITime>
}

const props = withDefaults(defineProps<ITimePickerProps>(), {
  width: 20,
  height: 40,
  activeColor: 'rgba(48, 130, 224, 0.6)',
  mode: 'half-hour',
  rangeColor: 'rgba(100, 255, 100, 0.5)',
  emptyText: '当前日期未选择数据'
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
// 获得真实的框选区域
const range = ref<IRange>();

const initRange = () => {
  const rect = calendarTable.value!.getBoundingClientRect();
  const right = Math.ceil(rect.right);
  const bottom = Math.ceil(rect.bottom);
  const left = right - timeSlot.value * props.width;
  const top = bottom - 7 * props.height;
  // 生成圈选位置的区域坐标
  range.value = {
    lt: {
      x: left,
      y: top
    },
    lb: {
      x: left,
      y: bottom
    },
    rt: {
      x: right,
      y: top
    },
    rb: {
      x: right,
      y: bottom
    }
  }
}
watch([() => props.mode, () => props.width, () => props.height], () => {
  nextTick(() => initRange());
})
onMounted(() => {
  initRange();
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
})

const timeBucketDisplay = computed(() => {
  return props.timeBucket.map((item, index) => {
    const { forenoon, afternoon } = item;
    const middle = timeSlot.value / 2;
    const forenoonSelected = generateIncrementalArray(middle).map((_, index) => {
      // 11 && 10 为1说明第一位被选中
      const selected = (forenoon & (1 << index)) > 0;
      return selected;
    });
    const afternoonSelected = generateIncrementalArray(middle).map((_, index) => {
      // 11 && 10 为1说明第一位被选中
      const selected = (afternoon & (1 << index)) > 0;
      return selected;
    });
    return {
      name: `星期${DISPLAY_DAY_MAP[index]}`,
      selectedTime: forenoonSelected.concat(afternoonSelected)
    }
  });
})

const timeBucketPreview = computed(() => {
  return timeBucketDisplay.value.map((item) => {
    return {
      name: item.name,
      selectedTime: generatePreviewTime(item.selectedTime, props.mode === 'hour' ? 60 : 30)
    }
  })
})

const onMouseUp = ($event: MouseEvent) => {
  if (!isShowSchedule.value) {
    return;
  }
  document.removeEventListener("mousemove", onMouseMove);
  const { clientX: x, clientY: y } = $event;
  const { width, height } = props;
  console.log(width, height)
  const selectedTime = getEndIndexFromPosition(range.value!, { x, y }, { width, height, maxHIndex: timeSlot.value - 1 })
  const { dIndex: endDIndex, hIndex: endHIndex } = selectedTime;
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
// TODO：事件的优化
const onMouseMove = ($event: MouseEvent) => {
  $event.preventDefault();
  if (isShowSchedule.value) {
    const { clientX, clientY } = $event;
    const { x, y } = leftTopTime.value;
    schedule.value.style.width =
      `${Math.abs(clientX - leftTopTime.value.x)}px`;
    schedule.value.style.height =
      `${Math.abs(clientY - leftTopTime.value.y)}px`;
    if (clientY < y) {
      schedule.value.style.top = `${clientY}px`;
    }
    if (clientX < x) {
      schedule.value.style.left = `${clientX}px`;
    }
  }
}
const onMouseDown = ($event: MouseEvent) => {
  const { clientX: x, clientY: y } = $event;
  const { width, height } = props;
  const selectedTime = getStartIndexFromPosition(range.value!, { x, y }, { width, height, maxHIndex: timeSlot.value - 1 });
  if (!selectedTime) {
    return;
  }
  document.addEventListener('mousemove', onMouseMove);
  const { dIndex, hIndex } = selectedTime;
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
  console.log(dIndex, hIndex);
  const day = props.timeBucket[dIndex];
  const middle = timeSlot.value / 2;
  const newDay = { ...day }
  if (hIndex < middle) {
    newDay.forenoon = day.forenoon ^ (1 << hIndex);
  } else {
    newDay.afternoon = day.afternoon ^ (1 << (hIndex - middle));
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

.calendar-preview {
  margin-top: 20px;

  .day-item {
    display: flex;
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }

    .day-name {
      color: #333;
    }

    .day-selectedTime {
      margin-left: 10px;
    }

    .day-no-selected {
      margin-left: 10px;
      color: #999;
      font-size: 14px;
    }
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