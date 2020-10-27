<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route'(to, from) {
      document.title = to.meta.title + (to.name === 'dispute' ? ` #${to.params.id}` : '') || 'Justto'
    }
  }
}

/* eslint-disable */
const loggedPerson = JSON.parse(localStorage.getItem('jusperson')) || {}
const loggedWorkspace = JSON.parse(localStorage.getItem('jusworkspace')) || {}
let d, s

window.$crisp=[];
window.CRISP_WEBSITE_ID="451192a7-4086-4e07-a01e-ceceb256000d";(function(){
  d=document;s=d.createElement("script");
  s.src="https://client.crisp.chat/l.js";
  s.async=1;
  d.getElementsByTagName("head")[0].appendChild(s);
  $crisp.push(["set", "user:nickname", loggedPerson.name]);
  $crisp.push(["set", "user:email", loggedPerson.emails && loggedPerson.emails.length ? loggedPerson.emails[0].address : '']);
  $crisp.push(["set", "user:phome", loggedPerson.phones]);
  $crisp.push(["set", "user:company", [loggedWorkspace.name, {description:loggedWorkspace.teamName}]]);
})();
/* eslint-enable */

</script>
