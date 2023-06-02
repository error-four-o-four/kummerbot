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
    this.index = this.values.length - 1;

    return this.index;
  },
  get() {
    return this.values[this.index];
  },
  set(pathname) {
    let index = this.values.length - 1;

    // first view was /chat route
    // and multiple modules were rendered
    if (index <= 0) {
      return [null, null];
    }

    let delta = 0;
    while (index >= 0) {
      if (pathname === this.values[index]) {
        break;
      }

      index -= 1;
      delta -= 1;
    }

    this.index = index;
    this.values.splice(this.index + 1);
    return [delta, this.index];
  },
};
