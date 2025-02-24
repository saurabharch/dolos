import { computed, WritableComputedRef } from "vue";
import { useRoute, useRouter } from "@/composables";

/**
 * Composable for getting/setting a value using a router query.
 */
export function useRouteQuery<T>(key: string, defaultValue: T, converter?: (v: string) => T): WritableComputedRef<T> {
  const route = useRoute();
  const router = useRouter();

  return computed<any>({
    get() {
      const value = route.value.query[key] as string;
      return (value ? (converter  ? converter(value) : value) : defaultValue) ?? defaultValue;
    },

    set(value: string) {
      const newRoute = {
        query: {
          ...route.value.query,
          [key]: String(value ?? defaultValue),
        }
      } as any;

      // Remove the key from the query if there is no value.
      if (value === null || value === undefined || value === "") {
        delete newRoute.query[key];
      }

      router.replace(newRoute).catch(() => { return false; });
    }
  });
}
