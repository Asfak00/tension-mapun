export function siteOrigin(): string {
  return typeof window === "undefined" ? "" : window.location.origin;
}

export function resultUrl(code: string, name?: string): string {
  const params = new URLSearchParams({ r: code });
  if (name) params.set("n", name);
  return `${siteOrigin()}/result?${params}`;
}

export function challengeUrl(code: string, name?: string): string {
  const params = new URLSearchParams({ c: code });
  if (name) params.set("n", name);
  return `${siteOrigin()}/battle?${params}`;
}

/** Display names travel in URLs; keep them short and plain. */
export function cleanName(raw: string | null | undefined): string {
  return (raw ?? "").replace(/[<>{}"]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export async function shareOrCopy(data: { title: string; text: string; url: string }): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "failed";
    }
  }
  return (await copyText(`${data.text} ${data.url}`)) ? "copied" : "failed";
}

async function renderPng(node: HTMLElement, size: { width: number; height: number }): Promise<string> {
  const { toPng } = await import("html-to-image");
  await document.fonts.ready;
  return toPng(node, { ...size, pixelRatio: 1, cacheBust: true });
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/** Renders a DOM node to PNG and triggers a download. html-to-image loads lazily. */
export async function downloadNodeAsPng(node: HTMLElement, filename: string, size: { width: number; height: number }) {
  triggerDownload(await renderPng(node, size), filename);
}

/** Shares the rendered image as a file where the browser allows it, else downloads it. */
export async function shareNodeAsPng(
  node: HTMLElement,
  filename: string,
  size: { width: number; height: number },
  text: string,
): Promise<"shared" | "downloaded" | "cancelled"> {
  const dataUrl = await renderPng(node, size);
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }
  triggerDownload(dataUrl, filename);
  return "downloaded";
}
