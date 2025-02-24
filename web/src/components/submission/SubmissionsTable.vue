<template>
  <v-data-table
    class="row-pointer"
    :headers="headers"
    :items="items"
    :search="searchValue"
    :dense="props.dense"
    :hide-default-footer="!props.pagination"
    :disable-pagination="!props.pagination"
    :footer-props="footerProps"
    sort-by="similarity"
    sort-desc
    must-sort
    fixed-header
    @click:row="rowClicked"
  >
    <template #item.name="{ item }">
      <div class="submission-info">
        <div class="submission-name">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <span v-on="on" v-bind="attrs">
                {{ item.name }}
              </span>
            </template>

            <div class="submission-path">
              <span>{{ item.path }}</span>
            </div>
          </v-tooltip>
        </div>
      </div>
    </template>

    <template #item.label="{ item }">
      <div class="submission-label">
        <label-dot :label="item.label.name" :color="item.label.color" />
        <label-text :label="item.label.name" colored />
      </div>
    </template>

    <template #item.similarity="{ item }">
      <span class="submission-similarity">
        <similarity-display
          :similarity="item.similarity"
          :dense="props.dense"
          progress
          dim-below-cutoff
        />
      </span>
    </template>

    <template #item.timestamp="{ item }">
      <span class="submission-timestamp">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-if="props.order"
              v-on="on"
              v-bind="attrs"
              :class="item.order === 1 ? 'primary--text' : 'text--secondary'"
            >
              #{{ item.order }}
            </span>
          </template>

          <span>This is the #{{ item.order }} submission in the cluster</span>
        </v-tooltip>

        <file-timestamp
          :class="props.order && item.order === 1 ? 'primary--text' : ''"
          :timestamp="item.timestamp"
          long
        />
      </span>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { DataTableHeader } from "vuetify";
import { useFileStore } from "@/api/stores";
import { File } from "@/api/models";
import { useRouter } from "@/composables";
import { useVModel } from "@vueuse/core";

interface Props {
  files: File[];
  search?: string;
  itemsPerPage?: number;
  dense?: boolean;
  pagination?: boolean;
  order?: boolean;
  concise?: boolean;
  disableSorting?: boolean;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 15,
});
const emit = defineEmits(["update:search"]);
const router = useRouter();
const fileStore = useFileStore();
const { similarities, hasTimestamps, hasLabels } = storeToRefs(fileStore);

// Search value.
const searchValue = useVModel(props, "search", emit);

// Table headers
const headers = computed<DataTableHeader[]>(() => {
  const h = [] as DataTableHeader[];
  h.push({
    text: "Submission",
    value: "name",
    sortable: props.disableSorting ? false : true,
  });

  // Only add the label header if there are labels.
  if (hasLabels.value) {
    h.push({
      text: "Label",
      value: "label",
      sortable: false,
    });
  }

  // Only add timestamp header when present.
  if (hasTimestamps.value && !props.concise) {
    h.push({
      text: "Timestamp",
      value: "timestamp",
      sortable: props.disableSorting ? false : true,
      filterable: false,
    });
  }

  h.push({
    text: "Highest similarity",
    value: "similarity",
    sortable: props.disableSorting ? false : true,
    filterable: false,
  });

  if (!props.concise) {
    h.push({
      text: "Lines",
      value: "lines",
      sortable: props.disableSorting ? false : true,
      filterable: false,
    });
  }

  return h;
});

// Footer props
const footerProps = {
  itemsPerPageOptions: [props.itemsPerPage, 25, 50, 100, -1],
  showCurrentPage: true,
  showFirstLastPage: true,
};

// Table items
// In the format for the Vuetify data-table.
const items = computed(() => {
  // Sort files on submission date.
  // This is used to determin the order number in the table.
  const sortedFiles = [...props.files].sort((a, b) => {
    if (!a.extra.timestamp) return 1;
    if (!b.extra.timestamp) return -1;
    return a.extra.timestamp.getTime() - b.extra.timestamp.getTime();
  });

  const items = props.files.map((file) => ({
    id: file.id,
    name: file.extra.fullName ?? file.shortPath,
    path: file.path,
    label: file.label,
    similarity: similarities.value.get(file)?.similarity ?? 0,
    timestamp: file.extra.timestamp,
    lines: file.content.split("\n").length ?? 0,
    order: sortedFiles.indexOf(file) + 1,
  }));

  // Sort the files by similarity, by default.
  // This is necessary for the 'limit' prop to work properly.
  items.sort((a, b) => b.similarity - a.similarity);

  return props.limit ? items.slice(0, props.limit) : items;
});

// When a row is clicked.
const rowClicked = (item: { id: string }): void => {
  router.push({ name: "Submission", params: { fileId: item.id } });
};
</script>

<style lang="scss" scoped>
.submission {
  &-label,
  &-path {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
