import Vue from 'vue';
import table from "./table.vue"

const components = [
  table
];

const install = (Vue,opts)=>{
  components.map(component=>{
    Vue.component(component.name,components);
  });
};



export default {
  install
}
