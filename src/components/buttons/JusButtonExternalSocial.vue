<template class="jus-button-external-social">
  <el-button type="info" class="jus-button-external-social__social-button"
  :class="{'facebook-button': type==='facebook', 'google-button': type==='google'}">
    <img v-if="type === 'facebook'" src="@/assets/icons/ic-facebook.svg">
    <img v-if="type === 'google'" src="@/assets/icons/ic-googleplus.svg">
    <span>
      {{type}}
    </span>
  </el-button>
</template>

<script>
export default {
  name: 'JusButtonExternalSocial',
  props: {
    type: String
  }
}
</script>

<style lang="scss">
.jus-button-external-social{
  .jus-button-external-social__social-button{
    padding: 0;
    width: 195px;
    img{
      float: left;
      padding: 12px;
      margin-bottom: 0px;
    }
    span{
      text-align: center;
      margin: 13px 0;
      display: block;
      text-transform: capitalize;
    }
    &.facebook-button{
      background-color: #3b5998;
      border-color: #3b5998;
      img{
        background-color: #263c68;
      }
    }
    &.google-button{
      background-color: #f44336;
      border-color: #f44336;
      img{
        background-color: #c53126;
      }
    }
  }
}
</style>
