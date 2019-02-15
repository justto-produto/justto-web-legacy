<template>
  <el-card class="jus-card-case">
    <div>
      <div class="jus-card-case__title">
        Dados do Caso
      </div>
    </div>
    <div class="jus-card-case__line">
      <span>Nº do Processo:</span>
      <div>
        <span>{{ colly.code }}</span>
      </div>
    </div>
    <div class="jus-card-case__line">
      <span>Autor:</span>
      <div v-for="claimant in colly.claimants">
        <span>&nbsp;{{ claimant }}</span>
      </div>
    </div>
    <div class="jus-card-case__line">
      <span>Advogado:</span>
      <div v-for="laywer in colly.lawyers">
        <span>&nbsp;{{ laywer }}</span>
      </div>
    </div>
    <div class="jus-card-case__line">
      <span>Réu:</span>
      <div>
        <span>{{ colly.respondent.name }}</span>
      </div>

    </div>
    <el-button class="jus-card-case__button" type="primary" @click="$router.push('status/' + colly.id)">
      Ver detalhes do caso
    </el-button>
  </el-card>
</template>

<script>
export default {
  name: 'JusCardCase',
  props: {
    colly: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
.jus-card-case{
  margin-top: 20px;
  border: 0;
  &__line {
    margin-bottom: 10px;
    font-size: 12px;
    > span:first-child {
      color: #adadad;
    }
    div {
      float: right;
      max-width: 58%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span:after {
        content: ',';
      }
      &:first-of-type span:after {
        content: '' !important;
      }
    }
  }
  &__title {
    margin-bottom: 10px;
    font-weight: 600;
  }
}
</style>
