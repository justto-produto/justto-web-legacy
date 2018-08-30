<template>
  <div class="user-avatar-image">
    <img :src="imagePath">
    <span>{{notifications}}</span>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: [
    'src'
  ],
  data () {
    return {
      notifications: '1'
    }
  },
  computed: {
    imagePath: function () {
      try {
        return require('@/assets/')
      } catch (e) {
        return 'https://scontent.fsjk2-1.fna.fbcdn.net/v/t1.0-9/481007_648847808475657_1507104068_n.jpg?_nc_cat=0&oh=0a9fe7a268b035222eabcd12f524dce5&oe=5BF42104'
      }
    }
  }
}
</script>

<style lang="scss">
.user-avatar-image{
  position: relative;
  img{
    object-fit: cover;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background-color: #f2f2f2;
  }
  span{
    min-width: 15px;
    min-height: 15px;
    line-height: 15px;
    padding: 1px;
    font-size: 12px;
    background-color: #ff4b54;
    position: absolute;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    top: 11px;
    left: -9px;
  }
}
</style>
