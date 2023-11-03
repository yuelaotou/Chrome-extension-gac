<template>
  <div class="main_app">
    <el-button type="warning" @click="handleClick">批量下载证书</el-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  methods: {
    handleClick() {
      // 处理点击事件的逻辑
      const checkedList = document.querySelectorAll('td > div > label.el-checkbox.is-checked');
      let cookieParentUserId = this.getCookieValue("bgac_parentId");
      let cookieUserId = this.getCookieValue("bgac_userId");
      let cookieToken = this.getCookieValue("bgac_token");

      const tdElements = Array.from(checkedList).map(label => label.closest('td'));

      // 分析有几列，决定是excel表格，还是pdf表格，从而查询不同的列表，最终去匹配 uuid
      const columnSize = Array.from(tdElements[0].parentNode.children).length;
      let combinedMap;
      if (columnSize > 7) {
        const excelList = this.getListExcel(cookieParentUserId, cookieUserId, cookieToken);
        combinedMap = excelList.list.reduce((acc, {cert_number, uuid}) => {
          acc.set(cert_number, uuid);
          return acc;
        }, new Map());
      } else {
        const pdfList = this.getListPdf(cookieParentUserId, cookieUserId, cookieToken);
        combinedMap = pdfList.list.reduce((acc, {cert_number, uuid}) => {
          acc.set(cert_number, uuid);
          return acc;
        }, new Map());
      }

      let certId='';
      tdElements.forEach(td => {
        const siblings = Array.from(td.parentNode.children); // 获取 td 元素的所有兄弟元素
        // 证书编号
        let certNumber;
        if (columnSize > 7) {
          certNumber = siblings[1].children[0].innerHTML
        } else {
          certNumber = siblings[2].children[0].innerHTML
        }
        const uuid = combinedMap.get(certNumber)
        console.log('certNumber: ' + certNumber + ", uuid: " + uuid);
        certId += uuid + ",";
      });
      certId=certId.slice(0, -1);
      const downloadJson = this.cerDownload(cookieParentUserId, cookieUserId, cookieToken, certId);
      chrome.runtime.sendMessage({ type: "openNewTab", url: downloadJson });
    },
    // 根据cookie名称获取特定的cookie值
    getCookieValue(cookieName) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
          return cookie.substring(cookieName.length + 1);
        }
      }
      return null;
    },
    getListExcel(cookieParentUserId, cookieUserId, cookieToken) {
      const url = 'https://certapi.frchain.net/bgac/api/system/cerFinishList';
      const formData = new FormData();
      formData.append('activeName', 'excel');
      formData.append('pageNum', 1);
      formData.append('pageSize', 100);
      return this.synchronousPost(url, formData, cookieParentUserId, cookieUserId, cookieToken);
    },
    getListPdf(cookieParentUserId, cookieUserId, cookieToken) {
      const url = 'https://certapi.frchain.net/bgac/api/system/cerFinishListPdf';
      const formData = new FormData();
      formData.append('activeName', 'pdf');
      formData.append('pageNum', 1);
      formData.append('pageSize', 100);
      return this.synchronousPost(url, formData, cookieParentUserId, cookieUserId, cookieToken);
    },
    cerDownload(cookieParentUserId, cookieUserId, cookieToken, cerId) {
      const url = 'https://certapi.frchain.net/bgac/api/system/cerDownload';
      const formData = new FormData();
      formData.append('cerId', cerId);
      return this.synchronousPost(url, formData, cookieParentUserId, cookieUserId, cookieToken);
    },
    synchronousPost(url, formData, cookieParentUserId, cookieUserId, cookieToken) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, false); // 设置为同步请求
      xhr.setRequestHeader('Parentuserid', cookieParentUserId);
      xhr.setRequestHeader('Userid', cookieUserId);
      xhr.setRequestHeader('Usertoken', cookieToken);
      xhr.send(formData);

      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText).data;
      } else {
        throw new Error('Request failed with status: ' + xhr.status);
      }
    }
  }
}
</script>

<style>
.main_app {
  position: fixed;
  z-index: 100001;
  right: 10px;
  bottom: 10px;
}
</style>
