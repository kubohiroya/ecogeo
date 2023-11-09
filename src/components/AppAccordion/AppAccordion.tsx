import styled from "@emotion/styled";
import React, { createContext, ReactElement } from "react";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

/* eslint-disable-next-line */
export interface AppAccordionProps {
  // defaultOpen?: boolean;
  lock?: boolean;
  expanded: boolean;
  onClickSummary: () => void;
  summaryIcon: ReactElement;
  summaryTitle: ReactElement;
  summaryAriaControl: string;
  children: React.ReactNode;
}

const StyledAccordion = styled(Accordion)`
  padding: 0 16px 0 16px;
  box-shadow: 1px 1px 2px 1px rgb(0, 0, 0, 0.3);
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  padding-bottom: 0;
`;
const StyledAccordionDetails = styled(AccordionDetails)`
  margin-top: 0;
  padding-top: 0;
`;

const StyledAppAccordion = styled.div`
  color: pink;
`;

export const AppAccordionExpandContext = createContext<boolean>(false);

export function AppAccordion(props: AppAccordionProps) {
  //const [expanded, setExpanded] = React.useState<boolean>(props.defaultOpen ? props.defaultOpen : false);
  const [delayedExpanded, setDelayedExpanded] = React.useState<boolean>(
    props.expanded ? props.expanded : false
  );
  return (
    <StyledAppAccordion>
      <StyledAccordion
        expanded={props.expanded}
        onChange={(event, expanded) => {
          if (props.lock) return;
          if (expanded) {
            setTimeout(() => setDelayedExpanded(expanded), 300);
          } else {
            setDelayedExpanded(expanded);
          }
          // setExpanded(expanded);
        }}
      >
        <StyledAccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={props.summaryAriaControl}
          onClick={() => !props.lock && props.onClickSummary()}
        >
          {props.summaryIcon}
          {props.summaryTitle}
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <AppAccordionExpandContext.Provider value={delayedExpanded}>
            {props.children}
          </AppAccordionExpandContext.Provider>
        </StyledAccordionDetails>
      </StyledAccordion>
    </StyledAppAccordion>
  );
}

export default AppAccordion;
