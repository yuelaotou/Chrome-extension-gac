// 监听来自插件的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 检查消息类型为"openNewWindow"，并且包含URL数据
    if (request.type === "openNewWindow" && request.url) {
        // 创建一个新窗口
        chrome.windows.create({
            url: request.url,
            focused: true
        });
    }
    if (request.type === "openNewTab" && request.url) {
        // 创建一个新标签页
        chrome.tabs.create({url: request.url});
    }
});
