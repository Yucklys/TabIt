# Chrome API 连接测试 (Chrome API Connection Test)

## 🧪 测试您的 Chrome API 连接

按照以下步骤测试您的 Chrome API 是否正确连接：

---

## 方法 1: 在浏览器控制台测试

### 步骤 1: 打开扩展
1. 在 Chrome 中打开扩展 (点击扩展图标)
2. 按 `F12` 打开开发者工具
3. 切换到 "Console" 标签

### 步骤 2: 运行测试命令

```javascript
// 测试 1: 获取当前标签页
chrome.tabs.query({ currentWindow: true }, (tabs) => {
  console.log('✅ 标签页数量:', tabs.length);
  console.log('标签页列表:', tabs);
});

// 测试 2: 发送消息到 background script
chrome.runtime.sendMessage({ action: 'getCurrentTabs' }, (response) => {
  console.log('✅ Background 响应:', response);
});

// 测试 3: 保存数据到 Storage
chrome.storage.local.set({ testKey: 'Hello Chrome!' }, () => {
  console.log('✅ 数据已保存');
  
  chrome.storage.local.get(['testKey'], (result) => {
    console.log('✅ 读取数据:', result.testKey);
  });
});

// 测试 4: 创建新标签页
chrome.tabs.create({ url: 'https://google.com' }, (tab) => {
  console.log('✅ 新标签页已创建:', tab.id);
});
```

### 预期结果
如果看到所有 ✅ 标记，说明 Chrome API 连接正常！

---

## 方法 2: 在 React 组件中测试

### 创建测试组件

在 `src/TestChrome.tsx` 创建：

```typescript
import { useState, useEffect } from 'react';
import * as ChromeAPI from './chromeApi';

function TestChrome() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setTestResults([]);

    try {
      // 测试 1: 检查 Chrome API 可用性
      if (ChromeAPI.isChromeAPIAvailable()) {
        addResult('✅ Chrome API 可用');
      } else {
        addResult('❌ Chrome API 不可用');
        return;
      }

      // 测试 2: 获取标签页
      try {
        const response = await ChromeAPI.getCurrentTabs();
        if (response.success) {
          addResult(`✅ 获取到 ${response.tabs.length} 个标签页`);
        }
      } catch (error) {
        addResult('❌ 获取标签页失败: ' + error.message);
      }

      // 测试 3: 存储操作
      try {
        await ChromeAPI.saveToStorage('testKey', { value: 'test' });
        addResult('✅ 数据保存成功');
        
        const data = await ChromeAPI.loadFromStorage('testKey');
        if (data) {
          addResult('✅ 数据读取成功: ' + JSON.stringify(data));
        }
        
        await ChromeAPI.removeFromStorage('testKey');
        addResult('✅ 数据删除成功');
      } catch (error) {
        addResult('❌ 存储操作失败: ' + error.message);
      }

      // 测试 4: 创建标签页 (可选 - 会实际创建标签页)
      // try {
      //   await ChromeAPI.createTab('https://google.com');
      //   addResult('✅ 标签页创建成功');
      // } catch (error) {
      //   addResult('❌ 标签页创建失败: ' + error.message);
      // }

      addResult('🎉 所有测试完成！');
    } catch (error) {
      addResult('❌ 测试过程出错: ' + error.message);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chrome API 连接测试</h2>
      <button onClick={runTests} style={{ marginBottom: '20px' }}>
        重新运行测试
      </button>
      
      <div>
        {testResults.map((result, index) => (
          <div key={index} style={{ 
            padding: '8px', 
            marginBottom: '4px',
            background: result.includes('✅') ? '#d4edda' : 
                       result.includes('❌') ? '#f8d7da' : 
                       result.includes('🎉') ? '#d1ecf1' : '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestChrome;
```

### 在 App.tsx 中使用

```typescript
import TestChrome from './TestChrome';

function App() {
  const [showTest, setShowTest] = useState(false);

  return (
    <div>
      {/* 添加测试按钮 */}
      <button onClick={() => setShowTest(!showTest)}>
        {showTest ? '隐藏测试' : '显示测试'}
      </button>

      {showTest && <TestChrome />}
      
      {/* 原有内容 */}
    </div>
  );
}
```

---

## 方法 3: 检查 background.js 日志

### 步骤 1: 打开 Background Script 控制台
1. 在 Chrome 中访问 `chrome://extensions/`
2. 找到 "TabSense" 扩展
3. 点击 "Service Worker" 或 "检查视图"

### 步骤 2: 查看日志
在控制台中应该看到：
```
TabManager initialized
Listening for messages...
```

### 步骤 3: 测试消息传递
在 popup 中执行操作，应该在 background console 看到：
```
Message received: { action: 'getCurrentTabs' }
Sending response: { success: true, tabs: [...] }
```

---

## 常见问题诊断

### ❌ 问题 1: `chrome is not defined`

**原因**: 代码不在扩展环境中运行

**解决方案**:
1. 确保在 Chrome 扩展中运行（不是普通网页）
2. 检查 `manifest.json` 配置正确
3. 重新加载扩展

### ❌ 问题 2: 消息发送失败

**测试代码**:
```javascript
try {
  const response = await chrome.runtime.sendMessage({ action: 'test' });
  console.log('Response:', response);
} catch (error) {
  console.error('Error:', error);
}
```

**可能原因**:
- Background script 未加载
- 消息监听器未设置
- 扩展未正确安装

**解决方案**:
1. 重新加载扩展
2. 检查 `background.js` 中的监听器
3. 查看 background script 控制台的错误

### ❌ 问题 3: Storage 不工作

**测试代码**:
```javascript
// 保存
await chrome.storage.local.set({ test: 'value' });

// 读取
const result = await chrome.storage.local.get(['test']);
console.log('Stored value:', result.test);
```

**可能原因**:
- 缺少 storage 权限
- Storage quota 超限

**解决方案**:
1. 在 `manifest.json` 添加 `"storage"` 权限
2. 清理旧数据: `chrome.storage.local.clear()`

### ❌ 问题 4: Tabs API 不工作

**测试代码**:
```javascript
chrome.tabs.query({}, (tabs) => {
  if (chrome.runtime.lastError) {
    console.error('Error:', chrome.runtime.lastError);
  } else {
    console.log('Tabs:', tabs);
  }
});
```

**可能原因**:
- 缺少 tabs 权限

**解决方案**:
在 `manifest.json` 添加权限：
```json
{
  "permissions": ["tabs", "activeTab"]
}
```

---

## 完整的测试清单

### ✅ 基础 API 测试

- [ ] Chrome API 可用性检查
- [ ] Runtime API (消息传递)
- [ ] Tabs API (查询标签页)
- [ ] Storage API (本地存储)

### ✅ 标签页操作测试

- [ ] 获取当前窗口标签页
- [ ] 获取所有标签页
- [ ] 创建新标签页
- [ ] 关闭标签页
- [ ] 更新标签页 (pin/mute)
- [ ] 复制标签页

### ✅ 存储操作测试

- [ ] 保存数据
- [ ] 读取数据
- [ ] 删除数据
- [ ] 清空存储
- [ ] 监听存储变化

### ✅ AI 功能测试

- [ ] AI 分组
- [ ] 生成摘要
- [ ] 分类准确性

### ✅ 会话管理测试

- [ ] 保存会话
- [ ] 加载会话
- [ ] 删除会话
- [ ] 列出所有会话

---

## 自动化测试脚本

创建 `test-chrome-api.js`:

```javascript
// 运行所有测试
async function runAllTests() {
  console.log('🧪 开始 Chrome API 测试...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // 测试 1: Tabs API
  try {
    const tabs = await chrome.tabs.query({});
    console.log('✅ Tabs API 工作正常');
    results.passed++;
  } catch (error) {
    console.error('❌ Tabs API 失败:', error);
    results.failed++;
  }

  // 测试 2: Storage API
  try {
    await chrome.storage.local.set({ test: 'value' });
    const result = await chrome.storage.local.get(['test']);
    if (result.test === 'value') {
      console.log('✅ Storage API 工作正常');
      results.passed++;
    }
    await chrome.storage.local.remove('test');
  } catch (error) {
    console.error('❌ Storage API 失败:', error);
    results.failed++;
  }

  // 测试 3: Runtime API
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'getCurrentTabs' 
    });
    if (response && response.success) {
      console.log('✅ Runtime API 工作正常');
      results.passed++;
    }
  } catch (error) {
    console.error('❌ Runtime API 失败:', error);
    results.failed++;
  }

  // 输出结果
  console.log(`\n📊 测试结果:`);
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`总计: ${results.passed + results.failed}`);

  return results;
}

// 运行测试
runAllTests();
```

在浏览器控制台运行此脚本。

---

## 性能测试

测试 API 调用性能：

```javascript
async function performanceTest() {
  console.log('⏱️ 开始性能测试...\n');

  // 测试 1: 单次查询
  const start1 = performance.now();
  await chrome.tabs.query({});
  const end1 = performance.now();
  console.log(`单次标签页查询: ${(end1 - start1).toFixed(2)}ms`);

  // 测试 2: 批量操作
  const start2 = performance.now();
  for (let i = 0; i < 10; i++) {
    await chrome.storage.local.set({ [`key${i}`]: `value${i}` });
  }
  const end2 = performance.now();
  console.log(`10次存储操作: ${(end2 - start2).toFixed(2)}ms`);

  // 测试 3: 消息传递
  const start3 = performance.now();
  await chrome.runtime.sendMessage({ action: 'getCurrentTabs' });
  const end3 = performance.now();
  console.log(`消息往返时间: ${(end3 - start3).toFixed(2)}ms`);
}

performanceTest();
```

---

## 🎉 测试完成后

如果所有测试通过，您的 Chrome API 连接已完全配置！

**下一步:**
1. 开始构建您的功能
2. 参考 `QUICK_START.md` 了解使用方法
3. 查看 `CHROME_API_EXAMPLES.md` 获取更多示例

**需要帮助?**
- 查看 Chrome 扩展文档: https://developer.chrome.com/docs/extensions/
- 检查 background.js 控制台的错误
- 确保所有权限在 manifest.json 中配置

祝开发愉快！🚀


