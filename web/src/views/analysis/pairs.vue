<template>
  <v-container fluid>
    <v-row class="heading" align="center">
      <v-col cols="12" md="6">
        <h2 class="heading-title">
          File pairs
        </h2>
        <div class="heading-subtitle text--secondary">
          A pair is a set of 2 files that are compared for similarity and matching code fragments.
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-card>
      <pairs-table :search.sync="search" :pairs="pairStore.pairsActiveList" />
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { usePairStore } from "@/api/stores";
import { useRouteQuery } from "@/composables";

const pairStore = usePairStore();
const search = useRouteQuery("search", "");
</script>
