# 权限按钮

如果没有权限不展示该按钮用法如下
eg：

```
<a-button type="primary" v-permission="['see']" @click="testButton">
  测试按钮权限
</a-button>
```

# 如果没有权限需要展示按钮禁用

````
<a-button type="primary" v-permission.disable="['see']" @click="testButton">
  测试按钮权限
</a-button>

<a-button type="primary" v-permission.disabled="['see']" @click="testButton">
  测试按钮权限
</a-button>
````
