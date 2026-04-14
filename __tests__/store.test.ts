import { useAppStore } from "@/store/useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  it("initialises with step 1 and no entry path", () => {
    const state = useAppStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.entryPath).toBeNull();
  });

  it("goToStep changes currentStep", () => {
    useAppStore.getState().goToStep(3);
    expect(useAppStore.getState().currentStep).toBe(3);
  });

  it("setEntryPath sets the path", () => {
    useAppStore.getState().setEntryPath("photo");
    expect(useAppStore.getState().entryPath).toBe("photo");
  });

  it("reset returns to initial state", () => {
    useAppStore.getState().goToStep(4);
    useAppStore.getState().setEntryPath("photo");
    useAppStore.getState().setPhoto(new File([""], "test.jpg"), "blob:test");
    useAppStore.getState().reset();
    const state = useAppStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.entryPath).toBeNull();
    expect(state.photo).toBeNull();
  });
});
