# how to work
- [how to work](#how-to-work)
  - [体验连接](#体验连接)
  - [数据结构的设计](#数据结构的设计)
    - [第一版](#第一版)
    - [第二版](#第二版)
    - [终版](#终版)
  - [功能实现](#功能实现)
    - [基础结构](#基础结构)
    - [点击处理](#点击处理)
    - [框选处理](#框选处理)
      - [事件设计](#事件设计)
        - [方案一](#方案一)
        - [方案二](#方案二)
          - [解决方案](#解决方案)
        - [结论](#结论)
      - [事件冲突处理](#事件冲突处理)
        - [问题分析](#问题分析)
        - [解决方案](#解决方案-1)
    - [如何绘制框选区域](#如何绘制框选区域)
  - [写在最后](#写在最后)
## 体验连接
## 数据结构的设计
数据结构非常重要，决定了组件的易用性，性能，以及组件的扩展性，设计好这里为整个项目打下了一个良好的基础。
### 第一版
当前组件想要的是能表示一个星期每天的时间段选择，可以很容易想到用一个`Array`来表示，数组的每一项表示当天的选择所以很容易想到用一个二维数组表示
```js
[
    [true, false, false, false, false, false, false, ...],
    ...
]
```
上边的结构完全可以满足功能上的要求，但是结构太笨重。使用组件的人需要理解为什么要设计这么笨的结构，使组件非常难用，数据传输方面也浪费了带宽。作为一个合格的程序员我们需要设计一个更优的数据结构，来减少数据传输，提高组件的易用性。
### 第二版
我们想要的就是用来标记一个连续区间的每一项是否被选中，这个很符合二进制的应用(在react和vue的源码中都有二进制的标记的使用)，所以有了二进制的数据结构，这么设计需要考虑数字是否会超过`Number.MAX_SAFE_INTEGER`，当前的设计上最多是48位远小于这个数，所以可以保证数据安全，理论上也是我认为的最优结构。
```js
[
    0,0,0,0,0,0,0
]
```
但是在实际开发中发现了一个问题就是js的二进制操作最大支持32位[js二进制说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)，所以当前设计也是有问题的。
还有一个想法就是存储的是一个字符串、例如`'1928|2029'`,使用｜来分割上午下午数据，保证了长度不会超过32位，但是这样又需要对数据进行解析，增加了复杂度，所以被我放弃了。

### 终版
既然使用二进制可以减少数据传输，降低理解难度。虽然最大有32位的限制，一天我们可以使用2个数字表示，上午下午各一个数字。这样满足了数据的安全性，并且可以减少数据传输。这样就有了最终版本的设计，出于语义化和扩展的考虑，使用一个对象来表示当天的选择。这个版本也是当前组件的最终版本。

```js
[
    {forenoon: 0, afternoon: 0}, // forenoon表示上午的选择，afternoon表示下午的选择
    {forenoon: 0, afternoon: 0},
    ...
]
```

## 功能实现
从功能上看要实现的是两个功能，
1. 鼠标点击切换状态
2. 选择区域来范围选择

### 基础结构
首先需要一个基础结构来承载组件，这个基础结构就是日历表格，日历表格的结构如下
```html
<div class="calendar">
<!--款选区域-->
<div class="schedule" ref="schedule" v-show="isShowSchedule" :style="{ background: rangeColor }"></div>
<!--日历表格-->
<table class="calendar-table" ref="calendarTable">
    <!--表头-->
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
    <!--表体-->
    <tbody class="calendar-body">
        <tr v-for="(day, dIndex) in timeBucketDisplay" :key="dIndex">
            <td colspan="2">
            {{ day.name }}
            </td>
            <!--每一个的时间段-->
            <td v-for="(selected, hIndex) in day.selectedTime" class="calendar-time-color"
                :class="{ 'active-time-color': selected }"
                :style="{ width: `${width}px`, height: `${height}px`, background: selected ? props.activeColor : 'none' }"
                :key="hIndex" :colspan="timeColSpan">
            </td>
        </tr>
    </tbody>
</table>
</div>
```

### 点击处理
点击在实现上非常简单，在元素上绑定事件，直接讲当前元素的状态取反即可。这里也用到了位运算的小技巧, `0^1=1, 1^1=0`,而且位运算性能上也是优于+-法的。
```js
/**
 * 反转二进制当前位上的1
 */
export function reverseBit(num: number, index: number) {
    return num ^ (1 << index);
}
```

### 框选处理
通过图可以看到，我们需要监听鼠标事件，通过mousedown、mouseup确定起点和终点，并通过mousemove事件来动态绘制区域。
TODO：补充框选图
#### 事件设计
##### 方案一
这个也是第一版的设计，原理上非常简单，在table的每一个时间段上绑定mousedown、mousemove、mouseup三个事件，这样很容易，这样通过vue的能力很容易获取到起点和终点的索引，只需要遍历数组，将对应的位取反就可以
```html
<!--每一个的时间段-->
<td v-for="(selected, hIndex) in day.selectedTime" class="calendar-time-color"
    @mousedown="mousedown(dIndex, hIndex)" 
    @mousemove="mousemove(dIndex, hIndex)"
    @mouseup="mouseup(dIndex, hIndex)"
    :class="{ 'active-time-color': selected }"
    :style="{ width: `${width}px`, height: `${height}px`, background: selected ? props.activeColor : 'none' }"
    :key="hIndex" :colspan="timeColSpan">
</td>
```
##### 方案二
将mouse系列事件绑定到容器上，解决了性能上的问题。
- 交互上有一个问题就是框选的区域不能拖出表格外（因为事件是加在表格上的）
- 还有就是对大量元素做了鼠标事件的监听，对性能是有影响的。

为了解决上边的问题，我们需要将事件绑定到外层容器上，这样就能解决了上边2个问题，但是还有个细节需要处理,mousemove事件在鼠标移动时，会频繁触发，我们在没有框选时也监听是完全没有必要的
###### 解决方案
基于以上原因做事件动态绑定的设计,在mousedown触发时，监听mousemove事件，在mouseup时解绑事件。这样做到了鼠标在表格上划过时不做无意义的事件触发
```js
const onMouseUp = ($event: MouseEvent) => {
  ...
  // 解绑move事件
  document.removeEventListener("mousemove", onMouseMove);
  // 确定选择的时间段
}
const onMouseMove = ($event: MouseEvent) => {
  $event.preventDefault();
  // 绘制选择框
  ...
}
const onMouseDown = ($event: MouseEvent) => {
  ...
  document.addEventListener('mousemove', onMouseMove);
  // 记录起点坐标
  ...
}
```

##### 结论
方案一和方案二各有优点和缺点，为了代码的健壮性考虑当前采用的的方案是方案一。
**来说说为什么不选择方案二？**
方案二的最大问题是兼容性问题，由于要动态获取坐标位置来计算选中区域，在网页布局中有很多情况可能会导致意想不到的结果，比如页面上有其他区域显示隐藏会导致表格位置的变动，这个是感知不到的（MutationObserver、ResizeObserver）都无法处理，除非需要用户手动调用内部方法手动矫正一遍，但这又增加了使用难度。

#### 事件冲突处理
##### 问题分析
mousedown、mousemove、mouseup三个事件与click事件冲突，在点击table时，会造成还原修改的问题。举个例子，mouseup将一个值由true改为false，click又触发了一次又将false改为true，相当于什么都没做。所以我们要想办法处理这个问题。有两个办法
##### 解决方案
1. 我们直接使用mouse系列事件、抛弃click事件
2. 在mousemove事件中修改pointEvents为none，说明有了移动用户是想框选一个区域，而不是点击在这时将click事件禁用，由于click是后触发的，所以不会造成还原修改的问题。
结论：从目前的功能看click和圈选想要的效果是一致的，所以我们直接使用mouse系列事件，这样更简单。

### 如何绘制框选区域
要想绘制一个框选区域，我们知道起点和结束点根据2个点坐标，利用2个坐标就可以绘制矩形，这里也有几种情况需要考虑。我们假设起点为`x1,y1`、终点为`x2,y2`。由于我们使用一个div来实现矩型，我们需要确认矩形的左上角，和长宽来绘制，通过观察可以发现左上角其实是`(Math.min(x1,x2), Math.min(y1,y2))`，长宽很容易想到就是坐标差的绝对值。
```js
const onMouseMove = ($event: MouseEvent) => {
  $event.preventDefault();
  if (isShowSchedule.value) {
    const { clientX, clientY } = $event;
    const { x, y } = leftTopTime.value;
    // schedule.value表示框选区域的dom元素
    schedule.value.style.width =
      `${Math.abs(clientX - leftTopTime.value.x)}px`;
    schedule.value.style.height =
      `${Math.abs(clientY - leftTopTime.value.y)}px`;
    schedule.value.style.top = `${Math.min(clientY, y)}px`;
    schedule.value.style.left = `${Math.min(clientX, x)}px`;
  }
}
```
## 写在最后




