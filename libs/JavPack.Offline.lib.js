class Offline {
  static defaultDir = "云下载";

  static defaultType = "plain";

  static defaultColor = "is-info";

  static defaultRename = "${code}${zh}${crack}";

  static defaultOptions = {
    tags: ["genres", "actors"],
    clean: true,
    cover: false,
  };

  static defaultMagnetOptions = {
    filter: ({ size }) => {
      const magnetSize = parseFloat(size);
      return magnetSize > 314572800 || magnetSize < 1;
    },
    max: 10,
  };

  static defaultVerifyOptions = {
    filter: ({ s }) => s > 157286400,
    clean: true,
    max: 10,
  };

  static defaultRenameTxt = {
    no: "-CD${no}",
    sep: "-",
    zh: "-C",
    crack: "",
  };

  static parseVar(txt, params, rep = "") {
    const reg = /\$\{(\w+)\}/g;
    return txt.replace(reg, (_, key) => (params.hasOwnProperty(key) ? params[key].toString() : rep)).trim();
  }

  static parseDir(dir, params) {
    const rep = "$0";
    let dirPaths = typeof dir === "string" ? dir.split("/") : [...dir];

    // 如果是VR影片，在actors类型的目录中插入VR子目录
    if (params.isVR && dirPaths.some(path => path.includes("${actor}"))) {
      dirPaths = dirPaths.flatMap((path) => {
        if (path.includes("${actor}")) {
          // 在actor路径后插入VR目录
          return [path, "VR"];
        }
        return [path];
      });
    }

    return dirPaths.map((item) => {
      const txt = this.parseVar(item, params, rep);
      return txt.includes(rep) ? null : txt;
    });
  }

  static getActions(config, params) {
    return config
      .flatMap(({ type = this.defaultType, match = [], exclude = [], ...item }, index) => {
        let { name, dir = this.defaultDir, rename = this.defaultRename } = item;
        if (!name) return null;

        rename = rename?.toString().trim();
        if (rename) {
          rename = rename.replaceAll("${sep}", "$sep");
          rename = rename.replaceAll("${zh}", "$zh");
          rename = rename.replaceAll("${crack}", "$crack");
          if (!rename.includes("${code}")) rename = "${code} " + rename;
        }

        if (type === "plain") return { ...item, dir: this.parseDir(dir, params), rename, idx: 0, index };

        let classes = params[type];
        if (!Array.isArray(classes) || !classes.length) return null;

        if (match.length) classes = classes.filter((item) => match.some((key) => item.includes(key)));
        if (exclude.length) classes = classes.filter((item) => !exclude.some((key) => item.includes(key)));
        if (!classes.length) return null;

        const typeItemKey = type.replace(/s$/, "");
        const typeItemTxt = "${" + typeItemKey + "}";

        return classes.map((cls, idx) => {
          const val = cls.replace(/♀|♂/, "").trim();
          return {
            ...item,
            dir: this.parseDir(dir, { ...params, [typeItemKey]: val }),
            rename: rename.replaceAll(typeItemTxt, val),
            name: name.replaceAll(typeItemTxt, val),
            index,
            idx,
          };
        });
      })
      .filter((item) => Boolean(item) && item.dir.every(Boolean))
      .map(({ color = this.defaultColor, desc, ...options }) => {
        return { ...options, color, desc: desc ? desc.toString() : options.dir.join("/") };
      });
  }

  static getOptions(
    { magnetOptions = {}, verifyOptions = {}, renameTxt = {}, rename, ...options },
    { codes, regex, cover, ...details },
  ) {
    options = { ...this.defaultOptions, ...options };
    magnetOptions = { ...this.defaultMagnetOptions, ...magnetOptions };
    verifyOptions = { ...this.defaultVerifyOptions, ...verifyOptions };
    renameTxt = { ...this.defaultRenameTxt, ...renameTxt };

    return {
      ...options,
      magnetOptions,
      verifyOptions,
      renameTxt,
      codes,
      regex,
      code: details.code,
      cover: options.cover ? cover : "",
      rename: this.parseVar(rename, details),
      tags: options.tags.flatMap((key) => details[key]).filter(Boolean),
    };
  }

  static getMagnets(magnets, { filter, sort, max }) {
    if (!magnets?.length) return [];
    if (filter) magnets = magnets.filter(filter);
    // 如果没有提供sort函数，使用默认的容量>中文字幕>破解排序
    const sortFunction = sort || this.magnetSort;
    magnets = magnets.toSorted(sortFunction);
    if (max) magnets = magnets.slice(0, max);
    return magnets;
  }

  /**
   * 默认磁链排序：容量大小 > 中文字幕 > 破解 > 其他
   * @param {Object} a - 磁链对象a
   * @param {Object} b - 磁链对象b
   * @returns {number} 排序结果
   */
  static magnetSort = (a, b) => {
    const sizeDiff = parseFloat(b.size) - parseFloat(a.size);
    if (sizeDiff !== 0) return sizeDiff;
    if (a.zh !== b.zh) return a.zh ? -1 : 1;
    if (a.crack !== b.crack) return a.crack ? -1 : 1;
    return 0;
  };
}
