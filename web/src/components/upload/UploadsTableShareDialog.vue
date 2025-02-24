<script lang="ts" setup>
import { useRouter } from "@/composables";
import { UploadReport } from "@/types/uploads/UploadReport";
import { useVModel } from "@vueuse/core";
import { computed } from "vue";
import { useSnackbar } from "../util/snackbar/useSnackbar";
import { useReportsStore } from "@/stores";

type Props = {
  open: boolean;
  report: UploadReport;
};
const props = withDefaults(defineProps<Props>(), {
  open: false,
});
const emit = defineEmits(["update:open", "update:reports"]);
const router = useRouter();
const reports = useReportsStore();

const reportShareRoute = computed(() =>
  reports.getReportShareRouteById(props.report.reportId)
);

const open = useVModel(props, "open", emit);
const snackbar = useSnackbar();

// Share URL
const shareUrl = computed(() => {
  const sharePath = router.resolve(reportShareRoute.value).href;

  const url = new URL(sharePath, window.location.href);
  return url.toString();
});

// Copy the share URL to the clipboard.
const copyShareUrl = (): void => {
  navigator.clipboard.writeText(shareUrl.value);

  snackbar.open({
    message: "Share URL copied to clipboard.",
    timeout: 5000,
  });
};
</script>

<template>
  <v-dialog v-model="open" max-width="500px">
    <v-card v-if="props.report">
      <v-card-title color="transparent" flat>
        <span>Share: {{ report.name }}</span>

        <v-spacer />

        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert type="info" text>
          Anyone with this link will be able to view the results of the analysis.
        </v-alert>

        <p>Share this report with others by sending them the following link:</p>

        <v-text-field
          v-model="shareUrl"
          label="Share URL"
          outlined
          dense
          readonly
          @focus="$event.target.select()"
        />

        <div class="d-flex mt-4">
          <v-spacer />
          <v-btn color="primary" text @click="copyShareUrl"> Copy URL </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
