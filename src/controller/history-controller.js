export default {
  index: -1,
  values: [],
  replace(pathname) {
    this.values[this.index] = pathname;
    return this.index;
  },
  add(item) {
    if (this.index < this.values.length - 1) {
      this.values = this.values.slice(0, this.index + 1);
    }

    this.values.push(item);
    this.index = this.values.length - 1;

    return this.index;
  },
  back() {
    this.index -= 1;

    return this.index;
  },
  go(pathname) {
    // used by router.pop()
    // change index but keep values
    let index = this.index;
    let delta = 0;
    while (index >= 0) {
      if (pathname === this.values[index]) {
        break;
      }

      index -= 1;
      delta -= 1;
    }

    this.index = index;
    return delta;
  },
  get(delta = 0) {
    return this.values[this.index + delta];
  },
  // @dev
  log() {
    return [
      'history:',
      this.index,
      `[${this.values
        .map((item, index) =>
          index === this.index ? item.toLocaleUpperCase() : item
        )
        .join(', ')}]`,
    ];
  },
};
