<template>
  <div class="onboarding-logo-step">
    <div class="onboarding-step-content">
      <div class="onboarding-step-content__title">
        <h2>Insira o logo da sua equipe</h2>
        <p>Os formatos aceitos são: PNG, JPG e SVG.</p>
      </div>
      <el-upload
        ref="upload"
        :show-file-list="true"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :before-remove="remove"
        :on-progress="loadingProgress"
        :class="{ 'el-upload--empty': imageUrl === '' }"
        :limit="1"
        action="http://localhost:3000/images"
        drag
        class="el-upload--logo"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="uploaded-logo"
        >
        <jus-icon
          v-else
          icon="upload-file"
          is-active
          class="el-icon-upload"
        />
        <div>
          <div class="el-upload__text">
            Arraste aqui ou <em>escolha um arquivo do seu computador</em>
          </div>
        </div>
      </el-upload>
    </div>
    <el-button
      :disabled="imageUrl === ''"
      type="primary"
      @click="$emit('onboarding:step:next')"
    >
      Próximo
    </el-button>
    <el-button
      type="text"
      @click="$emit('onboarding:step:next')"
    >
      Pular
    </el-button>
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
  data() {
    return {
      imageUrl: '',
      loading: false
    }
  },
  methods: {
    remove() {
      this.imageUrl = ''
    },
    loadingProgress(event, file, fileList) {
      this.loading = true
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.loading = false
    },
    beforeAvatarUpload(file) {
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!isValid) {
        this.$message.error('Formato inválido. Os formatos aceitos são: PNG, JPG e SVG.')
      }
      // if (!isLt2M) {
      //   this.$message.error('Avatar picture size can not exceed 2MB!')
      // }
      return isValid // && isLt2M
    }
  }
}
</script>

<style lang="scss">
.onboarding-logo-step {
  .el-upload--logo {
    width: 160px;
  }
  .uploaded-logo {
    object-fit: contain;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    padding: 10px;
  }
  @media (max-width: 991px) {
    .el-upload--logo {
      text-align: center;
      .el-upload {
        width: 100%;
      }
      .el-upload-list {
        margin: auto;
      }
      .el-upload-dragger {
        margin: auto;
      }
    }
  }
}
</style>
