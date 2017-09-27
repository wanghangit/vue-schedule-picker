<template>
  <div class="hello">
    <timeFrame :time-bucket1="data" ></timeFrame>
  </div>
</template>

<script>
import timeFrame from './timeFrame';
var dataFather=[
        {Week:0,
            name:'星期一',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {Week:1,
            name:'星期二',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {Week:2,
            name:'星期三',
        time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {Week:3,
            name:'星期四',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {Week:4,
            name:'星期五',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {Week:5,
            name:'星期六',
            time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        },
            {Week:6,
            name:'星期日',
        time:[{show:false,time:0},{show:false,time:1},{show:false,time:2},{show:false,time:3},{show:false,time:4},{show:false,time:5},{show:false,time:6},{show:false,time:7},{show:false,time:8},{show:false,time:9},{show:false,time:10},{show:false,time:11},{show:false,time:12},{show:false,time:13},{show:false,time:14},{show:false,time:15},{show:false,time:16},{show:false,time:17},{show:false,time:18},{show:false,time:19},{show:false,time:20},{show:false,time:21},{show:false,time:22},{show:false,time:23},{show:false,time:24},{show:false,time:25},{show:false,time:26},{show:false,time:27},{show:false,time:28},{show:false,time:29},{show:false,time:30},{show:false,time:31},{show:false,time:32},{show:false,time:33},{show:false,time:34},{show:false,time:35},{show:false,time:36},{show:false,time:37},{show:false,time:38},{show:false,time:39},{show:false,time:40},{show:false,time:41},{show:false,time:42},{show:false,time:43},{show:false,time:44},{show:false,time:45},{show:false,time:46},{show:false,time:47}]
        }
    ]
export default {
  data () {
    return {
      msg: '',
      data:dataFather
    }
  },
  methods:{
    change(msg){
      this.data=msg
      console.log(this.data)
    },
    add(){
      for(let i=0;i<dataFather.length;i++){
        console.log(1111)
        for(let j=0;j<10;j++){
          dataFather[i].time[j].show=true
          console.log(222)
        }
      }
      console.log(11)
    }
  },
  components:{
    timeFrame
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
