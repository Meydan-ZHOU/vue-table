<template>
  <div id="app">
    <v-table :fields="fields" :tableData="tableData" :sortOrder="sortOrder">
      <template slot-scope="scope">
        <button class="ui red button" @click="onClick('view-item',scope.row)">按钮{{scope.row.id}}</button>
      </template>
    </v-table>
  </div>
</template>

<script>

import VTable from "./components/table.vue";
import dataJson from "./data.json"

const tableColumns =[
  {
    name:"id",
    title:"id",
    width:"80px",
    sortField:'id',
    visible:true
  },
  {
    name:"status",
    title:"状态",
    width:"100px",
    sortField:'status',
    callback:'gender',
    visible:true
  },
  {
    name:"type",
    title:"类型",
    width:"100px",
    sortField:'type',
    visible:true
  },
  {
    name:"details.priority",
    title:"优先级",
    width:"100px",
    visible:true
  },
  {
    name:"created_at",
    title:"创建时间",
    width:"150px",
    sortField:'created_at',
    visible:true
  },
  {
    name:"updated_at",
    title:"更新时间",
    width:"150px",
    sortField:'updated_at',
    visible:true
  },
  {
    name:"updated_at",
    title:"更新时间",
    width:"150px",
    sortField:'updated_at',
    visible:true
  },
  {
    name:"__slot",
    title:"操作",
    width:"150px",
    visible:true
  },
];
export default {
  components: {VTable},
  name: 'App',
  data(){
    return {
      fields:tableColumns,
      tableData:dataJson.data,
      sortOrder:{
        field:'id',
        direction:'asc',
        ascText:'升序',
        descText:'降序'
      }
    };
  },
  created(){
    console.log(dataJson);
  },
  methods:{
    gender(value){
      return value+'经过处理';
    },
    onClick(name,item){
      console.log(item);
    }
  }
}
</script>

<style>
</style>
