<template>
  <div class="d-flex fill-height">
    <pair-code-match-editor
      class="fill-height fill-width"
      side="left"
      :pair="pair"
      :metadata="props.metadata"
      :selectedMatch.sync="selectedMatch"
      :hoveringMatch.sync="hoveringMatch"
    />
    <pair-code-match-editor
      class="fill-height fill-width"
      side="right"
      :pair="pair"
      :metadata="props.metadata"
      :selectedMatch.sync="selectedMatch"
      :hoveringMatch.sync="hoveringMatch"
    />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, withDefaults } from "vue";
import { Pair, Metadata, Fragment } from "@/api/models";

interface Props {
  pair: Pair;
  metadata: Metadata;
}

const props = withDefaults(defineProps<Props>(), {});

// Selected match.
const selectedMatch = shallowRef<Fragment | null>(null);
// Hovering match.
const hoveringMatch = shallowRef<Fragment | null>(null);
</script>
