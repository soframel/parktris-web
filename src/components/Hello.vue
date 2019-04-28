<template>
  <div class="hello">
    <h1>ParkTris</h1>
    <p>
      Welcome to Parktris.
    </p>

      <p v-if="this.settings.wantSlot">
        Check available slots !
      </p>

  </div>
</template>

<script>

export default {
  name: 'Hello',
  props: [
    'settings'
  ],
   data() {
    return {
      
    }
  },
  methods: {
  }, 
  beforeMount: function(){
    //redirect if no server settings
    if(!this.settings){
      this.$router.push('/')
    }

  }
}
</script>

<style src="../style.css"/>
