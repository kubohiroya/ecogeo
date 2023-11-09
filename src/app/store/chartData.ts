interface ChartData {
  title: string;
  scale: number;
  data: number[];
  setData: (data: number[]) => void;
}

const defaultChart = {
  title: 'Chart',
  scale: 1,
  data: [],
  setData: (data: number[]) => ({ data }),
};
