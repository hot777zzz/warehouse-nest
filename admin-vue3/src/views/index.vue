<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>仓库物资管理系统</h2>
        <p>
          仓库物资管理系统是一个基于B/S架构的仓库物资管理系统，主要分为用户端和管理员端。
          系统核心目标是解决当前仓库管理中的低效率、信息不对称等问题。
        </p>
        <p>
          <b>当前版本:</b>
          <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="success">管理员端</el-tag>
        </p>
        <p>
          <el-button type="primary" size="mini" icon="Box" plain @click="goTarget('/warehouse/material')">物资管理</el-button>
          <el-button type="success" size="mini" icon="Tickets" plain @click="goTarget('/warehouse/stock')">出入库管理</el-button>
          <el-button type="warning" size="mini" icon="DataAnalysis" plain @click="goTarget('/warehouse/dashboard')">数据看板</el-button>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>系统功能</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <h4>权限管理</h4>
            <ul>
              <li>JWT认证登录</li>
              <li>角色权限区分</li>
              <li>用户权限管理</li>
              <li>密码重置</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="8">
            <h4>物资管理</h4>
            <ul>
              <li>物资增删改查</li>
              <li>物资分类维护</li>
              <li>供应商管理</li>
              <li>分页搜索</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="8">
            <h4>出入库管理</h4>
            <ul>
              <li>入库登记</li>
              <li>出库登记</li>
              <li>库存校验</li>
              <li>历史记录</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>数据可视化</span>
          </div>
          <div class="body">
            <p>
              <svg-icon icon-class="chart" class-name="icon" />
              库存趋势图展示
            </p>
            <p>
              <svg-icon icon-class="chart" class-name="icon" />
              物资占比分析
            </p>
            <p>
              <svg-icon icon-class="chart" class-name="icon" />
              报表导出功能
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>预警功能</span>
          </div>
          <div class="body">
            <p>
              <svg-icon icon-class="message" class-name="icon" />
              库存低于安全阈值告警
            </p>
            <p>
              <svg-icon icon-class="message" class-name="icon" />
              物资过期提醒
            </p>
            <p>
              <svg-icon icon-class="message" class-name="icon" />
              异常出入库提醒
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>系统监控</span>
          </div>
          <div class="body">
            <p>
              <svg-icon icon-class="log" class-name="icon" />
              操作日志审计
            </p>
            <p>
              <svg-icon icon-class="log" class-name="icon" />
              登录日志记录
            </p>
            <p>
              <svg-icon icon-class="log" class-name="icon" />
              系统运行监控
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
const version = ref('1.0.0')

function goTarget(url) {
  if (url.startsWith('/')) {
    window.location.href = url
  } else {
    window.open(url, '__blank')
  }
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
