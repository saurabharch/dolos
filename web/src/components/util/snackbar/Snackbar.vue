<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { ref } from "vue";
import { SnackbarOptions } from "./SnackbarOptions";

const open = ref(false);
const options = ref<SnackbarOptions>();
const bus = useEventBus<string>("snackbar:open");

// Register bus events
bus.on((event, payload) => {
  // Open event
  if (event === "open") {
    options.value = payload;
    open.value = true;
  }

  // Close event
  if (event === "close") {
    open.value = false;
  }
});
</script>

<template>
  <v-snackbar v-model="open" v-bind="options" content-class="snackbar">
    <span>{{ options?.message }}</span>
    <v-spacer />
    <v-btn text @click="open = false" icon small>
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<style lang="scss">
.snackbar {
  display: flex;
  align-items: center;
}
</style>
