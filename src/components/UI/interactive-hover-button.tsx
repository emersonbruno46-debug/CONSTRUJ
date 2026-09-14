import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "./interactive-hover-button.css";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "filled" | "orange";
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(
  (
    {
      text,
      children,
      className,
      variant = "primary",
      href,
      target,
      rel,
      icon,
      ...props
    },
    ref
  ) => {
    const displayText = text || (typeof children === "string" ? children : "Botão");
    const displayIcon = icon || <ArrowRight size={18} aria-hidden="true" />;

    const buttonContent = (
      <>
        {/* Ponto / Bolha expansiva que preenche o botão */}
        <span className="interactive-dot" aria-hidden="true" />

        {/* Texto visível em repouso */}
        <span className="interactive-front">
          {children || displayText}
        </span>

        {/* Texto e ícone revelados no hover */}
        <span className="interactive-back" aria-hidden="true">
          <span>{displayText}</span>
          {displayIcon}
        </span>
      </>
    );

    const fullClassName = cn(
      "interactive-hover-button",
      `btn-variant-${variant}`,
      className
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={fullClassName}
          role="button"
          onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          aria-label={props["aria-label"] || (typeof displayText === "string" ? displayText : undefined)}
          id={props.id}
        >
          {buttonContent}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={fullClassName}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
