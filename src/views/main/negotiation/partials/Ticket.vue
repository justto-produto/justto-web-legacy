<template>
  <section>
    <header />
    <article>
      <Omnichannel />
    </article>
    <aside>
      <Overview />
    </aside>
  </section>
</template>

<script>
export default {
  name: 'Ticket',
  components: {
    Omnichannel: () => import('./omnichannel/Omnichannel'),
    Overview: () => import('./overview/Overview')
  }
}
</script>

<style lang="sass" scoped>

</style>
