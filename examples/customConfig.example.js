const magnetOptions = {
  filter: ({ size }) => {
    const magnetSize = parseFloat(size);
    return magnetSize > 314572800 || magnetSize < 1;
  },
  sort: (a, b) => {
    // 新排序：大小 > 中文字幕 > 破解
    const sizeDiff = parseFloat(b.size) - parseFloat(a.size);
    if (sizeDiff !== 0) return sizeDiff;
    if (a.zh !== b.zh) return a.zh ? -1 : 1;
    if (a.crack !== b.crack) return a.crack ? -1 : 1;
    return 0;
  },
  max: 10,
};

export default (config) => {
  return config.map((item) => {
    return { ...item, magnetOptions };
  });
};
