import Vue from "vue";
import { createApp } from 'vue'
import AppComponent from "./App/App.vue";
import {Button, Card} from "element-ui";

Vue.component("app-component", AppComponent);

Vue.use(Card);
Vue.use(Button);


joinContent(AppComponent)
// injectJsInsert()

function joinContent (element) {
    const div = document.createElement('div')
    div.id = 'joinContentApp'
    document.body.appendChild(div)
    createApp(element).mount('<button>')
    // this.$mount().$el.style.position = 'absolute'; // 可以设置绝对定位以便覆盖整个页面（示例中为绝对定位）
    // document.querySelector('button').appendChild(element); // 将Vue实例附加到指定的DOM元素下（这里使用id为'app'的元素作为父级容器）
}

// function injectJsInsert () {
//     document.addEventListener('readystatechange', () => {
//         const injectPath = 'js/frchain.js'
//         const script = document.createElement('script')
//         // 获取指定文件的 URL
//         chrome.runtime.getURL('/images/icon.png', function(url) {
//             console.log(url);
//         });
//
//         script.setAttribute('type', 'text/javascript')
//         script.src = chrome.runtime.getURL(injectPath)
//         document.body.appendChild(script)
//     })
// }
