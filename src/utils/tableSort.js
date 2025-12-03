/**
     * 排序比较
     * @param {string} propertyName 排序的属性名
     * @param {string} sort ascending(升序)/descending(降序)
     * @return {function}
     */
export function compare(propertyName, sort) {
  // 判断是否为数字
  function isNumberV(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  }
  
  return function (obj1, obj2) {
    let value1 = obj1[propertyName];
    let value2 = obj2[propertyName];
    // 数字类型的比较
    if(isNumberV(value1) || isNumberV(value2)){
      if (sort === "ascending") {
        return value1 - value2;
      } else {
        return value2 - value1;
      }
    }
    // 布尔值的比较：利用减法-转化true 和 false
    // true => 1   false ⇒ 0
    // true-false => 1  false-true => -1
    // 下面方法是按照先false后true的顺序排序，如果想先true后false，调整value1-value2 和  value2 - value1的顺序即可
    else if(_.isBoolean(value1) && _.isBoolean(value2)){
      if (sort === "ascending") {
        return value1 - value2;
      } else {
        return value2 - value1;
      }
    }
    // 字符比较使用localeCompare()
    else {
      const res = value1.localeCompare(value2, "zh");
      return sort === "ascending" ? res : -res;
    }
  };
}