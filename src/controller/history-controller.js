export default {
  index: -1,
  values: [],
  push(item) {
    if (this.index < this.values.length - 1) {
      this.values = this.values.slice(0, this.index + 1);
    }

    this.values.push(item);
    this.index = this.values.length - 1;

    return this.index;
  },
  pop() {
    this.values.pop();
    this.index =
      this.index > this.values.length - 1 ? this.values.length - 1 : this.index;

    return this.index;
  },
  get() {
    return this.values[this.index];
  },
  set(pathname) {
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
};
