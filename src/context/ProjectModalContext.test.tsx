import { renderHook, act } from "@testing-library/react";
import { ProjectModalProvider, useProjectModal, Project } from "./ProjectModalContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProjectModalProvider>{children}</ProjectModalProvider>
);

const mockProject: Project = {
  id: 1,
  title: "Test Project",
  slug: "test-project",
  shortDescription: "Short",
  longDescription: "Long",
  technologies: ["React"],
  github: "https://github.com/test",
  demo: "https://demo.com",
  thumbnail: "/test.png",
  carouselImages: ["/01.jpg"],
  date: 2026,
};

describe("ProjectModalContext", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("throws an error when used outside the provider", () => {
  expect(() => renderHook(() => useProjectModal())).toThrow(
    "useProjectModal must be used within a ProjectModalProvider"
  );
});


  it("provides default values inside the provider", () => {
    const { result } = renderHook(() => useProjectModal(), { wrapper });

    expect(result.current.project).toBeNull();
    expect(typeof result.current.openModal).toBe("function");
    expect(typeof result.current.closeModal).toBe("function");
  });

  it("openModal sets the project", () => {
    const { result } = renderHook(() => useProjectModal(), { wrapper });

    act(() => {
      result.current.openModal(mockProject);
    });

    expect(result.current.project).toEqual(mockProject);
  });

  it("closeModal resets the project to null", () => {
    const { result } = renderHook(() => useProjectModal(), { wrapper });

    act(() => {
      result.current.openModal(mockProject);
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.project).toBeNull();
  });

  it("sets body overflow to hidden when a project is opened", () => {
    const { result } = renderHook(() => useProjectModal(), { wrapper });

    act(() => {
      result.current.openModal(mockProject);
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("resets body overflow when modal is closed", () => {
    const { result } = renderHook(() => useProjectModal(), { wrapper });

    act(() => {
      result.current.openModal(mockProject);
    });

    act(() => {
      result.current.closeModal();
    });

    expect(document.body.style.overflow).toBe("");
  });
});
