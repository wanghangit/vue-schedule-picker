<template>
    <div class="calendar-preview">
        <div v-for="day in timeBucketPreview" class="day-item">
            <span class="day-name">{{ day.name }}</span>
            <div class="day-selectedTime" v-for="time in day.selectedTime">
                <span>{{ time }}</span>
            </div>
            <div class="day-no-selected" v-show="!day.selectedTime.length">{{ props.emptyText }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { ITimeDisplay } from '../types';
import { generatePreviewTime } from '../utils';

const props = defineProps<{
    timeBucketDisplay: Array<ITimeDisplay>;
    mode: string;
    emptyText: string;
}>()

const timeBucketPreview = computed(() => {
  return props.timeBucketDisplay.map((item) => {
    return {
      name: item.name,
      selectedTime: generatePreviewTime(item.selectedTime, props.mode === 'hour' ? 60 : 30)
    }
  })
})

</script>

<style lang="scss" scoped>
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
</style>