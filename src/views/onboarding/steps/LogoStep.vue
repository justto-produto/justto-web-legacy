<template lang="html">
  <div class="onboarding-logo-step">
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Insira o logo do seu Escritório</h2>
        <p>Os formatos aceitos são: PNG, JPG e SVG.</p>
      </div>
      <el-upload
        ref="upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        action="http://localhost:3000/images"
        drag
        class="el-upload--logo">
        <img v-if="imageUrl" :src="imageUrl" class="uploaded-logo">
        <JusIcon v-else icon="upload-file" class="el-icon-upload"/>
        <div>
          <div class="el-upload__text">Arraste aqui ou <em>escolha um arquivo do seu computador</em></div>
        </div>
      </el-upload>
    </div>
    <el-button type="primary" @click="$emit('onboarding:step:next')">Próximo</el-button>
    <el-button type="text" @click="remove">Pular</el-button>
  </div>
</template>

<script>
export default {
  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    remove () {
      this.imageUrl = ''
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!')
      }
      // if (!isLt2M) {
      //   this.$message.error('Avatar picture size can not exceed 2MB!')
      // }
      return isJPG // && isLt2M
    }
  }
}
</script>

<style lang="scss">
.onboarding-logo-step {
  .uploaded-logo {
    object-fit: cover;
    border-radius: 6px;
    width: 100%;
    height: 100%;
  }
}
</style>
