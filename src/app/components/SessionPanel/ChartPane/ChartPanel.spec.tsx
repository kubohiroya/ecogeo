import { render } from "@testing-library/react";

import { ChartPane } from "./ChartPane";
import { ChartTypes } from "~/app/models/ChartType";

describe('ChartPanelComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ChartPane
        chartType={ChartTypes.ManufactureShare}
        onChangeChartType={() => {}}
        onChangeScale={() => {}}
        scale={1}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
