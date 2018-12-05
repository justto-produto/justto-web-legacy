<template>
  <div class="view-import view-import--new">
    <h1>Nova importação de casos</h1>
    <JusViewMain>
      <template slot="main">
        <el-steps :active="active" class="el-steps--circle" finish-status="success">
          <el-step/>
          <el-step/>
          <el-step/>
          <el-step/>
        </el-steps>
      </template>
    </JusViewMain>
  </div>
</template>

<script>
export default {
  name: 'NewImport',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang="scss">
.view-import {
  > h1 {
    margin-left: 20px;
  }
}

.view-import--new {
}
</style>
