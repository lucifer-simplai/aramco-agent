export const INITIAL_USER_SESSION_STATE = {
  userId: undefined,
  PIM_SID: undefined,
  A_ID: undefined,
  TENANT_ID: undefined,
  PROJECT_ID: undefined,
  TOKEN: undefined,
  APP_ID: undefined,
  GUEST_USER_ID: undefined,
  GUEST_USER_NAME: undefined,
  chatConfig: undefined,
  conversationReferenceId: undefined,
  initialMessage: undefined,
  error: false,
};

export const createUserSessionConfig = (set, get) => ({
  userSessionConfig: INITIAL_USER_SESSION_STATE,
  updateUserSessionConfig(updateUserSessionConfigParams) {
    set((prev) => {
      return {
        ...prev,
        userSessionConfig: {
          ...prev?.userSessionConfig,
          ...updateUserSessionConfigParams,
        },
      };
    });
  },
  resetUserSessionConfig() {
    set({ userSessionConfig: { ...INITIAL_USER_SESSION_STATE } });
  },
});
