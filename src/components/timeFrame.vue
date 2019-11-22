<template>
<div>
    <div class="calendar">
     
        <div class="schedule" ref="schedule"></div>
        <table class="calendar-table">
            <thead class="calendar-head">
                <tr>
                    <th rowspan="2" class="calendar-head-title" colspan="2">星期/时间</th>
                    <th colspan="24">上午</th>
                    <th colspan="24">下午</th>
                </tr>
                <tr >
                    <td colspan="2" v-for="(item, index) in thead" :key="index">{{item}}</td>    
                </tr>
            </thead>
            <tbody class="calendar-body">
                <tr v-for="(item, index) in timeBucket" :key="index">
                    <td colspan="2" onselectstart="return false" ondragstart="return false">{{item.name}}</td>
                    <td v-for="(data, index) in item.time" :data-week="item.Week" :data-time="data.time" v-on:mouseup="mouseUp" v-on:mousemove="mouseMove"  class="calendar-time-color" v-on:click="addColor" :class="{selectTime:data.show}" v-on:mousedown="mouseDown" :key="index"></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="calendar-weekTime">
        <span class="calendar-weekTime-cancel" v-on:click="reseting">撤销所有惭怍</span>
        <span @click="kan">查看元素</span>
        <ul>
            <li v-show="item.Time.length>0" v-for="(item, index) in weekList" :key="index">
                <span>{{item.name}}:</span>
                <span class="timeList" v-for="(time, index) in item.Time" :key="index">
                    <span :data-show="time.show">
                        <time>{{time.start}}</time>~<time>{{time.end}}</time>
                        <span class="del" v-show="time.show==1">×</span>
                    </span>
                </span>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
var data=[
        {week:0,
            name:'星期一',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {week:1,
            name:'星期二',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {week:2,
            name:'星期三',
        time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {week:3,
            name:'星期四',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {week:4,
            name:'星期五',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {week:5,
            name:'星期六',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {week:6,
            name:'星期日',
        time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        }
    ]
export default{
    props:{
        timeBucket1:{
            type:Array,
            default:data
        },
    },
    created(){
    
    },
    watch:{
      timeBucket1(val){
          this.timeBucket=val
      }
    },
    data(){
        return{
            thead:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            schedule:{start:{x:0,y:0,time:0,week:0},end:{x:0,y:0,time:0,week:0}},
            timeBucket:this.timeBucket1,
        }
    },
    methods:{
         kan(){
          console.log(this.timeBucket1)
        },
        addColor(e) {
            //动态显示被选中状态
            // console.log( this.$refs)
      
            let schedule=this.$refs.schedule;
            let week=e.target.dataset.week;
            let time=e.target.dataset.time;
            let domWidth=e.target.offsetWidth;
            let domHeight=e.target.offsetHeight;
            this.timeBucket[week].time[time].show=!this.timeBucket[week].time[time].show;
        },
        mouseDown(e){
            let schedule=this.$refs.schedule;
            schedule.style.opacity=1;
            schedule.style.display='block';
            schedule.style.left=e.clientX+'px';
            schedule.style.top=e.clientY+'px';
            this.schedule.start.x=e.clientX;
            this.schedule.start.y=e.clientY;
            this.schedule.start.time=e.target.dataset.time;
            this.schedule.start.week=e.target.dataset.week;
        },
        mouseUp(e){
            let schedule=this.$refs.schedule;
            this.schedule.end.x=e.clientX;
            this.schedule.end.y=e.clientY;
            this.schedule.end.time=e.target.dataset.time;
            this.schedule.end.week=e.target.dataset.week;
            schedule.style.width=0;
            schedule.style.height=0;
            schedule.style.display='none';
            schedule.style.opacity=0;
            let j=Number(this.schedule.start.time);
            let i=this.schedule.start.week;
            let jlength= this.schedule.end.time;
            let ilength=this.schedule.end.week;
            if((this.schedule.end.week-this.schedule.start.week)>0||(this.schedule.end.time-this.schedule.start.time)>0){
              for(let i=this.schedule.start.week;i<=ilength;i++){

                 for(let m=j;m<=jlength;m++){
                         
                        this.timeBucket[i].time[m].show=!this.timeBucket[i].time[m].show;
                }
              }
            }
          
        },
        mouseMove(e){
            if(this.$refs.schedule.style.display=='block'){
            let schedule=this.$refs.schedule;
            this.schedule.end.x=e.clientX;
            this.schedule.end.y=e.clientY;
            schedule.style.width=(this.schedule.end.x- this.schedule.start.x)+'px';
            schedule.style.height=(this.schedule.end.y- this.schedule.start.y)+'px';
            }
            
        },
        reseting(){
            for(let i=0;i<this.timeBucket.length;i++){
                for(let j=0;j<this.timeBucket[i].time.length;j++){
                    this.timeBucket[i].time[j].show=false
                }
            }
        }
    },
    computed:{
        weekList() {
            let listTime=[];
            let list=[
                {name:'星期一',
                 Time:[]
                },
                {name:'星期二',
                 Time:[]
                },
                {name:'星期三',
                 Time:[]
                },
                {name:'星期四',
                 Time:[]
                },
                {name:'星期五',
                 Time:[]
                },
                {name:'星期六',
                 Time:[]
                },
                {name:'星期日',
                 Time:[]
                }
                ];
            
            
            let m=0;
            let selectTimeList=[[],[],[],[],[],[],[]];
            let timeList=[[],[],[],[],[],[],[]];
            let start=[[],[],[],[],[],[],[]];
            let end=[[],[],[],[],[],[],[]];
            let success=[
                {
                    name:'星期一',
                    Time:[]
                },
                {
                    name:'星期二',
                    Time:[]
                },
                {
                    name:'星期三',
                    Time:[]
                },
                {
                    name:'星期四',
                    Time:[]
                },
                {
                    name:'星期五',
                    Time:[]
                },
                {
                    name:'星期六',
                    Time:[]
                },
                {
                    name:'星期日',
                    Time:[]
                },
            ];
            //提取出被选中的对象组成数组
            for(let i=0;i<this.timeBucket.length;i++){
                for(let j=0;j<this.timeBucket[i].time.length;j++){
                    if(this.timeBucket[i].time[j].show){
                        this.timeBucket[i].time[j].week=i;
                        listTime.push(this.timeBucket[i].time[j])
                    }
                }
            }
            for(let i=0;i<listTime.length;i++){
                if(listTime[i].week==0){
                    list[0].Time.push(listTime[i])
                }
                if(listTime[i].week==1){
                    list[1].Time.push(listTime[i])
                }
                if(listTime[i].week==2){
                    list[2].Time.push(listTime[i])
                }
                if(listTime[i].week==3){
                    list[3].Time.push(listTime[i])
                }
                 if(listTime[i].week==4){
                    list[4].Time.push(listTime[i])
                }
                if(listTime[i].week==5){
                    list[5].Time.push(listTime[i])
                }
                if(listTime[i].week==6){
                    list[6].Time.push(listTime[i])
                }
            }
            //格式化时间并组装成数组
            for(let i=0;i<list.length;i++){
                let timeList=list[i].Time;
                for(let j=0;j<list[i].Time.length;j++){
                    list[i].Time[j].value=(list[i].Time[j].time+1)*0.5;
                    list[i].Time[j].value1=list[i].Time[j].value-0.5;
                    let int=parseInt(list[i].Time[j].value);
                    let float=list[i].Time[j].value-int;
                    let int1=parseInt(list[i].Time[j].value1);
                    let float1=list[i].Time[j].value1-int1;
                    if(int<10){
                        if(float>0){
                            list[i].Time[j].value="0"+int+":30";
                        }
                        else{
                            list[i].Time[j].value="0"+int+":00";
                        }
                    }
                    else{
                        if(float>0){
                            list[i].Time[j].value=int+":30";
                        }
                        else{
                            list[i].Time[j].value=int+":00";
                        }
                    }
                    if(int1<10){
                        if(float1>0){
                            list[i].Time[j].value1="0"+int1+":30";
                        }
                        else{
                            list[i].Time[j].value1="0"+int1+":00";
                        }
                    }
                    else{
                        if(float1>0){
                            list[i].Time[j].value1=int1+":30";
                        }
                        else{
                            list[i].Time[j].value1=int1+":00";
                        }
                    }
                    if(list[i].Time[j].week==0){
                       selectTimeList[0].push(list[i].Time[j].value1);
                       selectTimeList[0].push(list[i].Time[j].value);
                    }
                    if(list[i].Time[j].week==1){
                        selectTimeList[1].push(list[i].Time[j].value1);
                        selectTimeList[1].push(list[i].Time[j].value);
                    }
                    if(list[i].Time[j].week==2){
                        selectTimeList[2].push(list[i].Time[j].value1);
                        selectTimeList[2].push(list[i].Time[j].value);
                    }
                    if(list[i].Time[j].week==3){
                        selectTimeList[3].push(list[i].Time[j].value1);
                        selectTimeList[3].push(list[i].Time[j].value);
                    }
                    if(list[i].Time[j].week==4){
                        selectTimeList[4].push(list[i].Time[j].value1);
                        selectTimeList[4].push(list[i].Time[j].value);
                    }
                    if(list[i].Time[j].week==5){
                        selectTimeList[5].push(list[i].Time[j].value1);
                        selectTimeList[5].push(list[i].Time[j].value);
                    }
                    if(list[i].Time[j].week==6){
                        selectTimeList[6].push(list[i].Time[j].value1);
                        selectTimeList[6].push(list[i].Time[j].value);
                    }
                }
            }
            //连续选中的元素合并时间段
            for(let i=0;i<selectTimeList.length;i++){
                for(let j=0;j<selectTimeList[i].length;j++){
                    let index=timeList[i].indexOf(selectTimeList[i][j]);
                    if(index<0){
                        timeList[i].push(selectTimeList[i][j]);
                    }
                    else{
                        timeList[i].splice(index,1);
                    }
                }
            }
            //分离起始时间和结束时间
            for(let i=0;i<timeList.length;i++){
                for(let j=0;j<timeList[i].length;j++){
                        if(j%2==0){
                            start[i].push(timeList[i][j]);
                        }
                        else{
                            end[i].push(timeList[i][j]);
                        }
                }
            }
            //将起始时间和结束时间组合对象拼装进数组
           for(let i=0;i<start.length;i++){
                for(let j=0;j<start[i].length;j++){
                    let o=new Object();
                    o.start=start[i][j];
                    o.end=end[i][j];
                    o.show=0;
                    success[i].Time.push(o);
                }
            }
        return success;
        }
    }

}
</script>
<style>
li{
    list-style: none;
}
table{
    display: table;
    -webkit-user-select:none;/* and add the CSS class here instead */ 
    -ms-user-select:none; 
    user-select:none;/**禁止选中文字*/ 
}
td,th{
    display: table-cell;
    padding: 0;
}
.schedule{
    background: rgba(100,255,0,.5);
    width: 0;
    height: 0;
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
}
.calendar-weekTime-cancel{
    background: indianred;
    color: #ffffff;
    padding: 5px;
    border-radius: 5px;
}
.calendar{
    position: relative;
    margin-bottom: 10px;
}
.calendar-table{
    border-collapse: collapse;
}
.calendar-table thead{
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
}
.calendar-table tr, .calendar-table td, .calendar-table th{
    border: 1px solid #ddd;
    font-size: 12px;
    text-align: center;
    min-width: 12px;
    line-height: 2.8em;
}
.table{
    box-sizing: border-box;
}
.calendar-head{
    box-sizing: border-box;
}
.calendar-body{
    box-sizing: border-box;
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}
.calendar-time-color{
    background: #f5f5f5;
    border: 1px solid #ddd;
    font-size: 12px;
    text-align: center;
    min-width: 12px;
    line-height: 1.8em;
    transition:background 500ms linear;
}
.selectTime{
    background:rgba(255,100,0,.3);
    transition:background 500ms linear;

}
.calendar-weekTime{
   margin-top: 10px;
   font-size: 12px;
   line-height: 2em;
   max-width: 640px;
}
.calendar-weekTime-cancel{
    float: right
}
.calendar-weekTime ul{
    display: block;
    padding-left: 0;
    padding-right: 90px;
}
.calendar-weekTime ul li{
    display:block;
    text-align: left;
}
.timeList{
    margin: 0 5px;
}
.del{
   color: #333;
}
.del :hover{
    display: block;
    color: red
}
</style>