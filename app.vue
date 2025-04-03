<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast />
  </div>
</template>
<script setup>
// Add CSS via useHead
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.amcharts.com/lib/5/index.css'
    }
  ]
})

</script>