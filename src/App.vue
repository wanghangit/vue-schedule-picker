<template>
  <div class="calendar">
    <div class="schedule" ref="schedule" v-show="isShowSchedule"></div>
    <table class="calendar-table">
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
      <tbody class="calendar-body" ref="calendarBody">
        <tr v-for="(day, dIndex) in timeBucketDisplay" :key="dIndex">
          <td colspan="2" onselectstart="return false" ondragstart="return false">
            {{ day.name }}
          </td>
          <td v-for="(selected, hIndex) in day.selectedTime" class="calendar-time-color" :class="{ selectTime: selected }"
            :style="{ width: `${width}px`, height: `${height}px` }" :key="hIndex">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, readonly, ref } from "vue";
import { generateIncrementalArray, generateSelectedTime, getEndIndexFromPosition, getStartIndexFromPosition } from "./utils";

const props = defineProps({
  width: {
    type: Number,
    default: 15,
  },
  height: {
    type: Number,
    default: 40,
  },
});

// 生成表头的时间段0~23点
const thead = readonly(generateIncrementalArray(24));
// 存贮所有时间段
const timeBucket = ref(generateSelectedTime());
// 选择任务
const schedule = ref();
const isShowSchedule = ref(false);
// 用来框选区域的两个定位元素
const leftTopTime = ref();
const rightBottomTime = ref();
const container = ref();
// 框选区域的容器
const calendarBody = ref();
const range = ref<IRange>();
onMounted(() => {
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = calendarBody.value;
  const right = offsetLeft + offsetWidth;
  const bottom = offsetTop + offsetHeight;
  const left = right - 48 * props.width;
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
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
})

const timeBucketDisplay = computed(() => {
  return timeBucket.value.map((item, index) => {
    const { forenoon, afternoon } = item;
    const forenoonSelected = generateIncrementalArray(24).map((_, index) => {
      // 11 && 10 为1说明第一位被选中
      const selected = (forenoon & (1 << index)) > 0;
      return selected;
    });
    const afternoonSelected = generateIncrementalArray(24).map((_, index) => {
      // 11 && 10 为1说明第一位被选中
      const selected = (afternoon & (1 << index)) > 0;
      return selected;
    });
    return {
      name: `星期${index + 1}`,
      selectedTime: forenoonSelected.concat(afternoonSelected)
    }
  });
})

const onMouseUp = ($event: MouseEvent) => {
  if(!isShowSchedule.value){
    return;
  }
  document.removeEventListener("mousemove", onMouseMove);
  const { clientX: x, clientY: y } = $event;
  const { width, height } = props;
  const selectedTime = getEndIndexFromPosition(range.value!, { x, y }, { width, height })
  const { dIndex, hIndex } = selectedTime;
  // 从起始点到终点的一个数组遍历
  const { dIndex: startDIndex, hIndex: startHIndex } = leftTopTime.value;
  for (let i = startDIndex; i <= dIndex; i++) {
    for (let j = startHIndex; j <= hIndex; j++) {
      changeColor(i, j);
    }
  }
  isShowSchedule.value = false;
  schedule.value.style.width = 0;
  schedule.value.style.height = 0;
  // // REMOVE: mock
  // setTimeout(() => {

  // }, 1000);
}
// TODO：事件的优化
const onMouseMove = ($event: MouseEvent) => {
  if (isShowSchedule.value) {
    const { clientX, clientY } = $event;
    schedule.value.style.width =
      `${clientX - leftTopTime.value.x}px`;
    schedule.value.style.height =
      `${clientY - leftTopTime.value.y}px`;
  }
}
const onMouseDown = ($event: MouseEvent) => {
  const { clientX: x, clientY: y } = $event;
  const { width, height } = props;
  const selectedTime = getStartIndexFromPosition(range.value!, { x, y }, { width, height });
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
  const day = timeBucket.value[dIndex];
  if (hIndex < 24) {
    day.forenoon = day.forenoon ^ (1 << hIndex);
  } else {
    day.afternoon = day.afternoon ^ (1 << (hIndex - 24));
  }
}

</script>

<style lang="scss">
.calendar {
  position: relative;
  margin-bottom: 10px;

  .calendar-head {
    box-sizing: border-box;
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
    -webkit-user-select: none;
    /* and add the CSS class here instead */
    -ms-user-select: none;
    user-select: none;
    /**禁止选中文字*/

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

.calendar-weekTime-cancel {
  background: indianred;
  color: #ffffff;
  padding: 5px;
  border-radius: 5px;
}

.calendar-time-color {
  background: #f5f5f5;
  border: 1px solid #ddd;
  font-size: 12px;
  text-align: center;
  box-sizing: border-box;
  transition: background 500ms linear;
}

.selectTime {
  background: rgba(255, 100, 0, .3);
  transition: background 500ms linear;

}

.calendar-weekTime {
  margin-top: 10px;
  font-size: 12px;
  line-height: 2em;
  max-width: 640px;
}

.calendar-weekTime-cancel {
  float: right
}

.calendar-weekTime ul {
  display: block;
  padding-left: 0;
  padding-right: 90px;
}

.calendar-weekTime ul li {
  display: block;
  text-align: left;
}

.timeList {
  margin: 0 5px;
}

.del {
  color: #333;
}

.del :hover {
  display: block;
  color: red
}
</style>