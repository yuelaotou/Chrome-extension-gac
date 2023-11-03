import Vue from "vue";
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
    new Vue({
        el: '#joinContentApp',
        render: function (createElement) {
            return createElement(element);
        },
    });
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
