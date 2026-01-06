import clsx from "clsx";

import { useAtlasMode, type AtlasMode } from "../context/AtlasModeContext";

const MODES: Array<{ label: string; description: string; value: AtlasMode }> = [
  {
    label: "Earth journeys",
    description: "Atlas globe · real-world hops",
    value: "earth"
  },
  {
    label: "Galaxy jumps",
    description: "Star cluster · hyperspace plots",
    value: "galaxy"
  }
];

interface AtlasModeToggleProps {
  className?: string;
}

export function AtlasModeToggle({ className }: AtlasModeToggleProps) {
  const { mode, setMode } = useAtlasMode();

  return (
    <div className={clsx("atlas-mode-toggle", className)}>
      <span className="atlas-mode-toggle__label" aria-hidden>
        Mode
      </span>
      <div className="atlas-mode-toggle__options" role="group" aria-label="Atlas mode">
        {MODES.map((option) => {
          const isActive = option.value === mode;
          return (
            <button
              key={option.value}
              type="button"
              className={clsx("atlas-mode-toggle__option", { active: isActive })}
              onClick={() => setMode(option.value)}
              aria-pressed={isActive}
            >
              <span>{option.label}</span>
              <small>{option.description}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

