echarts-vue
=

在vue中使用echarts图表的例子。

起步
--
```
vue create echarts-vue
cd echarts-vue
yarn add echarts
```

使用
--

几个要点：
- vue中获取dom对象用this.$refs，然后即可使用echarts去初始化这个节点，也要有宽高，不然不显示
- 更新数据需要重新调用setOption函数，而且是整体配置，所以需要单独配置数据，单独配置其他选项并引用数据，最后进行调用配置。
- 也使用了间隔定时器的设置与清除

