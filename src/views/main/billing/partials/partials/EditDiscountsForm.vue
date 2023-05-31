<template>
  <el-form
    v-if="visible"
    :model="form"
  />

  <DiscountsDescription
    v-else
    v-loading="loading"
    :discounts="discounts"
    @click="() => { visible = true }"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'EditDiscountsForm',

  components: {
    DiscountsDescription: () => import('./partials/DiscountsDescription.vue')
  },

  props: {
    contract: {
      type: Object,
      required: true
    },

    customer: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    loading: false,
    visible: false,
    form: {
      discounts: []
    }
  }),

  computed: {
    ...mapGetters({
      discountsById: 'contractDiscountList'
    }),

    discounts() {
      return this.discountsById[this.contract?.id] || []
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions(['getContractDiscountList']),

    init() {
      if (!this.contract?.id) return

      // this.loading = true

      this.getContractDiscountList(this.contract?.id).then((discounts = []) => {
        this.form.discounts = [...discounts]
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
