export function useConfirm(message = "Are you sure you want to proceed?") {
  function confirmAction(e: React.FormEvent | React.MouseEvent) {
    if (!window.confirm(message)) {
      e.preventDefault();
    }
  }

  return { confirmAction };
}
