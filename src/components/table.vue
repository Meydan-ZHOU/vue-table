<template>
  <div class="v-table-wrapper">
    <div class="operate-wrapper">
        <span v-if="isMobile">
          <select v-model="sortOrder.field">
            <option v-for="(field,fieldIndex) in tableFields" v-if="field.sortField" :value="field.sortField">{{field.title}}</option>
          </select>
          <select v-model="sortOrder.direction">
            <option value="asc">{{sortOrder.ascText}}</option>
            <option value="desc">{{sortOrder.descText}}</option>
          </select>
        </span>
      <button class="pull-right" @click="settingVisibleShow">Setting</button>
    </div>
    <table
      :class="['v-table', 'v-table-border', 'v-table-stripe','v-table-hover',{'isMobile':isMobile} ]"
      cellpadding="0"
      cellspacing="0">
      <thead v-if="!isMobile">
      <tr>
        <template v-for="(field,fieldIndex) in tableFields">
          <template v-if="field.visible">
            <th
              :key="fieldIndex"
              :style="{width:field.width}"
              @click="orderBy(field,$event)"
              :class="[ sortClass(field),{'sortField':isSortField(field),'currSort':sortOrder.field===field.sortField}]"
            >
              {{field.title}}
            </th>
          </template>
        </template>
      </tr>
      </thead>
      <tbody>
      <template v-for="(item,itemIndex) in filterTableData">
        <tr
          :key="itemIndex"
          :item-index="itemIndex"
        >
          <template v-for="(field,fieldIndex) in tableFields">
            <template v-if="field.visible">
              <template v-if="isSpecialField(field.name)">
                <td class="inline-actions">
                  <slot :row="item"></slot>
                </td>
              </template>
              <template v-else>
                <td v-if="field.callback"
                    :key="fieldIndex"
                    v-html="callCallback(field,item)"
                    :data-label = 'field.title'
                ></td>
                <td v-else
                    :key="fieldIndex"
                    v-html="getObjectValue(item,field.name,'null')"
                    :data-label = 'field.title'
                ></td>
              </template>
            </template>
          </template>
        </tr>
      </template>
      </tbody>
    </table>
    <div class="setting-modal" v-show="settingVisible">
      <div class="header">Settings</div>
      <div class="setting-content">
        <div class="header">Visible fields</div>
        <div v-for="(field, fieldIndex) in tableFields" class="field">
          <div class="field-checkbox">
            <input type="checkbox" :checked="field.visible" @change="toggleField(fieldIndex, $event)">
            <label>{{ field.title }}</label>
          </div>
        </div>
      </div>
      <div class="footer">
        <button @click="settingVisibleHide">关闭</button>
      </div>
    </div>
    <div class="mask" v-show="settingVisible"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name:'v-table',
    props:{
      fields: {
        type: Array,
        required: true
      },
      tableData:{
        type: Array,
        required: true
      },
      sortOrder:{
        type: Object,
        required: true
      }
    },
    data(){
      return {
        tableFields:[],
        isMobile:false,
        settingVisible:false
      };
    },
    computed:{
      filterTableData(){
        let {field,direction} = this.sortOrder;
        let backArr;
        backArr = this.sortBy(this.tableData,field,direction);
        return backArr;
      }
    },
    mounted(){
      this.normalizeFields();
      this.onResize();
      window.onresize = ()=>{
        this.onResize();
      } ;
    },
    methods:{
      orderBy(field,event){
        if(!this.isSortField(field)) return;
        if(this.sortOrder.field === field.sortField){
          if(this.sortOrder.direction==='asc'){
            this.sortOrder.direction = 'desc';
          }else{
            this.sortOrder.direction = 'asc';
          }
        }else{
          this.sortOrder.field     = field.sortField;
          this.sortOrder.direction = 'asc';
        }
      },
      callCallback(field, item){
        if(typeof(this.$parent[field.callback])==='function'){
          let value = this.getObjectValue(item, field.name);
          return this.$parent[field.callback](value);
        }
      },
      sortBy(array,field,direction){
        return array.sort((a,b)=>{
          let aF = a[field];
          let bF = b[field];
          if(typeof aF === 'string'){
            if(direction==='asc'){
              return aF.localeCompare(bF);
            }else{
              return bF.localeCompare(aF);
            }
          }
          if(direction==='asc'){
            return aF-bF;
          }else{
            return bF-aF;
          }
        });
      },
      normalizeFields(){
        this.tableFields = [];
        let obj;
        this.fields.forEach(field=>{
          obj = {
            name:field.name,
            width:field.width,
            title:field.title,
            sortField:field.sortField==='undefined'?'':field.sortField,
            visible:field.visible,
            callback:field.callback==='undefined'?'':field.callback
          }
          this.tableFields.push(obj);
        });
      },
      isSpecialField(fieldName){
        return fieldName.slice(0,2)==='__';
      },
      getObjectValue(object,path,defaultValue){
        defaultValue = (typeof defaultValue==='undefined')?null:defaultValue;
        let obj =object;
        if(path.trim()!==''){
          let keys = path.split('.');
          keys.forEach((key)=> {
            if(obj!==null&&typeof obj[key]!=='undefined'&&obj[key]!==null){
              obj = obj[key];
            }else{
              obj = defaultValue
            }
          });
        }
        return obj;
      },
      isSortField(field){
        return !(typeof field.sortField === 'undefined');
      },
      sortClass(field){
        if(field.sortField!==this.sortOrder.field) return '';
        return this.sortOrder.direction === 'asc'?'sort-asc':'sort-desc';
      },
      toggleField (index) {
        if (index < 0 || index > this.tableFields.length) return;

        this.tableFields[index].visible = ! this.tableFields[index].visible
      },
      onResize(){
        if(window.innerWidth<860){
          this.isMobile = true;
        }else{
          this.isMobile = false;
        }
      },
      settingVisibleShow(){
        this.settingVisible = true;
      },
      settingVisibleHide(){
        this.settingVisible = false;
      },
    }
  };
</script>

<style type="text/stylus" lang="stylus" scoped>
  .operate-wrapper{
    padding:10px 0;
    vertical-align middle;
    .pull-right{
      float : right;
    }
  }
  .v-table{
    width:100%;
    margin :10px auto;
    box-sizing border-box;
    border-collapse separate;
    color:#606269;
    font-size :14px;
    &.v-table-border{
      border:1px solid #ebeef5;
      border-bottom :none;
      border-right none;
      th,td{
        border-right :1px solid #ebeef5;
        border-bottom :1px solid #ebeef5;
      }
    }
    &.v-table-stripe{
      tbody{
        tr:nth-child(2n+1){
          background-color #fafafa;
        }
      }
    }
    &.v-table-hover{
      tbody {
        tr {
          transition: background-color .25s ease;
          &:hover {
            background-color #ededed;
            cursor default;
          }
        }
      }
    }
    th,td{
      padding :10px ;
      box-sizing border-box;
      vertical-align middle;
      overflow hidden;
      text-overflow ellipsis;
      word-break break-all;
      text-align left;
      line-height :24px;
      cursor default;
    }
    .sortField{
      cursor pointer;
      &:hover{
        color:#2185d0;
      }
    }
    .sort-asc:before{
      content:'+';
    }
    .sort-desc:before{
      content:'-';
    }
    th.currSort{
      color:red;
    }
    &.isMobile{
      border:none;
      tbody{
        tr{
          display flex;
          flex-wrap wrap;
          padding 10px;
          td{
            display inline-block;
            width :50%;
            border :none;
            &:before{
              display block;
              content:attr(data-label);
              text-align left;
              font-weight bold;
              padding-bottom 10px;
            }
            &.inline-actions{
              width :100%;
            }
          }
        }
      }
    }
  }
  .setting-modal{
    width :50%;
    height :auto;
    position fixed;
    top:30%;
    left:50%;
    transform :translate(-50%,0);
    z-index :1000;
    background #fff;
    border-radius :5px;
    padding :20px;
    box-sizing border-box;
    .setting-content {
      margin:20px 0;
      background :#fafafa;
      padding :10px;
    }
    .header{
      font-size :18px;
    }
    .footer{
      text-align right;
    }
  }
  .mask{
    content:'';
    width :100%;
    height :100%;
    display :block;
    position :fixed;
    top:0;
    left :0;
    background :rgba(0,0,0,.5);
  }
</style>
