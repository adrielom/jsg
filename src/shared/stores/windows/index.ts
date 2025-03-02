import { defineStore } from "pinia";
import { useHierarchy } from "./hierarchy";

const useWindows = defineStore("window", () => {
  const hierarchy = useHierarchy();

  return {
    hierarchy,
  };
});

export default useWindows;
