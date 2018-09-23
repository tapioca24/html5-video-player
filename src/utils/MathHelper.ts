const MathHelper = {
  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(min, value), max);
  },

  lerp(value1: number, value2: number, amount: number, isClamped: boolean = false) {
    if (isClamped) {
      amount = this.clamp(amount, 0, 1);
    }
    return (1 - amount) * value1 + amount * value2;
  },

  map(value: number, min1: number, max1: number, min2: number, max2: number, isClamped: boolean = false) {
    const amount = (value - min1) / (max1 - min1);
    return this.lerp(min2, max2, amount, isClamped);
  },
};

export default MathHelper;
