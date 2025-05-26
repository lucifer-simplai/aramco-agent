import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createUserSessionConfig } from "./createUserSessionConfig";

export const useAppStore = create()(
  persist(
    (...a) => ({
      ...createUserSessionConfig(...a),
    }),
    {
      name: "simplai-embed",
    },
  ),
);
