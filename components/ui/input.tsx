import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  isError?: boolean;
  errorMessage?: string | string[] | undefined | null;
  disableSpace?: boolean;
}

const sanitizeSpaces = (value: string) => value.replace(/ /g, "");

function Input({
  isError = false,
  errorMessage = "",
  disableSpace = false,
  className,
  type,
  maxLength,
  onInput,
  onPaste,
  onDrop,
  onKeyDown,
  ...props
}: InputProps) {
  const renderError = Array.isArray(errorMessage)
    ? errorMessage.join(", ")
    : errorMessage;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Block e, E, +, - and arrow up/down (which increment/decrement the value)
      if (["e", "E", "+", "-", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }
    }
    onKeyDown?.(e);
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Prevent scroll from changing number value
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleInput = (e: any) => {
    const input = e.currentTarget as HTMLInputElement;

    // Enforce maxLength for number inputs — the HTML maxLength attribute
    // is ignored by browsers on type="number", so we must do it manually.
    if (type === "number" && maxLength !== undefined) {
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
      }
    }

    if (disableSpace) {
      const nativeEvent = e.nativeEvent as InputEvent;

      if (
        nativeEvent.inputType === "insertReplacementText" ||
        nativeEvent.inputType === "insertText"
      ) {
        const rawValue = input.value;
        const sanitized = sanitizeSpaces(rawValue);
        if (sanitized !== rawValue) {
          const cursorBefore = input.selectionStart ?? rawValue.length;
          const newCursor = sanitizeSpaces(
            rawValue.slice(0, cursorBefore),
          ).length;
          input.value = sanitized;
          input.setSelectionRange(newCursor, newCursor);
        }
      }
    }

    onInput?.(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disableSpace) {
      const clipboardText = e.clipboardData.getData("text");
      const sanitized = sanitizeSpaces(clipboardText);
      if (sanitized !== clipboardText) {
        e.preventDefault();
        const input = e.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const nextValue = `${input.value.slice(0, start)}${sanitized}${input.value.slice(end)}`;
        input.value = nextValue;
        input.setSelectionRange(
          start + sanitized.length,
          start + sanitized.length,
        );
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // Enforce maxLength on paste for number inputs
    if (type === "number" && maxLength !== undefined) {
      e.preventDefault();
      const input = e.currentTarget;
      const clipboardText = e.clipboardData.getData("text");
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const next = `${input.value.slice(0, start)}${clipboardText}${input.value.slice(end)}`;
      input.value = next.slice(0, maxLength);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    onPaste?.(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    if (disableSpace) {
      const droppedText = e.dataTransfer.getData("text");
      const sanitized = sanitizeSpaces(droppedText);
      if (sanitized !== droppedText) {
        e.preventDefault();
        const input = e.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const nextValue = `${input.value.slice(0, start)}${sanitized}${input.value.slice(end)}`;
        input.value = nextValue;
        input.setSelectionRange(
          start + sanitized.length,
          start + sanitized.length,
        );
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    onDrop?.(e);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        type={type}
        data-slot="input"
        aria-invalid={isError}
        className={cn(
          "file:text-foreground !p-5 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-[44px] w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
          isError &&
          "ring-destructive/20 dark:ring-destructive/40 border-destructive",
          // Hide number input spinners (arrows) across all browsers
          type === "number" &&
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        {...(disableSpace && {
          autoCorrect: "off",
          autoCapitalize: "off",
          spellCheck: false,
        })}
        maxLength={type !== "number" ? maxLength : undefined}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onInput={handleInput}
        onPaste={handlePaste}
        onDrop={handleDrop}
        {...props}
      />
      {isError && renderError && (
        <p className="text-xs text-destructive">{renderError}</p>
      )}
    </div>
  );
}

export { Input };