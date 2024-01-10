"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { AnimationWrapper } from "@components/utils/AnimationWrapper.tsx";
import { reactCompose } from "@components/utils/ReactCompose";

interface AccordionProps extends React.PropsWithChildren {
  multiple?: boolean;
  // ---
  base?: string;
  padding?: string;
  spaceY?: string;
  rounded?: string;
  width?: string;
  classes?: string;
}

interface AccordionItemProps extends React.PropsWithChildren {
  base?: string;
  spaceY?: string;
  classes?: string;
}

interface AccordionControlProps extends React.PropsWithChildren {
  controls: string;
  open?: boolean;
  disabled?: boolean;
  // Root
  base?: string;
  hover?: string;
  padding?: string;
  rounded?: string;
  classes?: string;
  // Slots
  lead?: ReactNode;
}

interface AccordionPanelProps extends React.PropsWithChildren {
  id: string;
  base?: string;
  padding?: string;
  rounded?: string;
  classes?: string;
}

// Context ---

interface AccordionContextState {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  allowMultiple: boolean;
  setAllowMultiple: Dispatch<SetStateAction<boolean>>;
}

const AccordionContext = createContext<AccordionContextState>({
  selected: [],
  setSelected: () => {},
  allowMultiple: false,
  setAllowMultiple: () => {},
});

/** Component: An Accordion child element. */
const AccordionRoot: React.FC<AccordionProps> = ({
  multiple = false,
  // Root
  base = "",
  padding = "",
  spaceY = "space-y-1",
  rounded = "rounded",
  width = "w-full",
  classes = "",
  // Children
  children,
}): React.ReactElement => {
  const [selected, setSelected] = useState<string[]>([]);
  const [allowMultiple, setAllowMultiple] = useState<boolean>(multiple);

  return (
    <div
      className={`${base} ${padding} ${spaceY} ${rounded} ${width} ${classes}`}
      data-testid="accordion"
    >
      <AccordionContext.Provider
        value={{
          selected,
          setSelected,
          allowMultiple,
          setAllowMultiple,
        }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

/** Component: An Accordion child element. */
const AccordionItem: React.FC<AccordionItemProps> = ({
  base = "",
  spaceY = "",
  classes = "",
  // Children
  children,
}): React.ReactElement => {
  return (
    <div
      className={`${base} ${spaceY} ${classes}`}
      data-testid="accordion-item"
    >
      {children}
    </div>
  );
};

const AccordionControl: React.FC<AccordionControlProps> = ({
  controls,
  open = false,
  disabled = false,
  // Control
  base = "flex text-start items-center space-x-4 w-full",
  hover = "hover:bg-white/5",
  padding = "py-2 px-4",
  rounded = "rounded",
  classes = "",
  // Children
  lead,
  children,
}): React.ReactElement => {
  let ctx = useContext<AccordionContextState>(AccordionContext);

  useEffect(() => {
    if (open) setOpen();
  }, [open]);

  const onclick = () => {
    ctx.selected.includes(controls) ? setClosed() : setOpen();
  };

  const setOpen = () => {
    if (ctx.allowMultiple === false) ctx.setSelected([]);
    ctx.setSelected((currentValue) => [...currentValue, controls]);
  };

  const setClosed = () => {
    ctx.setSelected(ctx.selected.filter((itemId) => itemId !== controls));
  };

  return (
    <button
      type="button"
      className={`${base} ${hover} ${padding} ${rounded} ${classes}`}
      aria-expanded={ctx.selected.includes(controls)}
      aria-controls={`accordion-panel-${controls}`}
      onClick={onclick}
      disabled={disabled}
    >
      {/* Lead */}
      {lead && <div>{lead}</div>}
      {/* Content */}
      <div className="flex-1">{children}</div>
      {/* State Indicator */}
      <div>{ctx.selected.includes(controls) ? "-" : "+"}</div>
    </button>
  );
};

const AccordionPanel: React.FC<AccordionPanelProps> = ({
  id,
  // Panel
  base = "",
  padding = "py-2 px-4",
  rounded = "",
  classes = "",
  // Children
  children,
}): React.ReactElement => {
  let ctx = useContext<AccordionContextState>(AccordionContext);

  return (
    <div
      role="region"
      aria-hidden={ctx.selected.includes(id)}
      aria-labelledby={id}
    >
      <AnimationWrapper show={ctx.selected.includes(id)}>
        <div className={`${base} ${padding} ${rounded} ${classes}`}>
          {children}
        </div>
      </AnimationWrapper>
      {/* NOTE: AnimationWrapper replaces: */}
      {/* {ctx.selected.includes(id) && ( ... )} */}
    </div>
  );
};

export const Accordion = reactCompose(AccordionRoot, {
  Item: AccordionItem,
  Control: AccordionControl,
  Panel: AccordionPanel,
});
