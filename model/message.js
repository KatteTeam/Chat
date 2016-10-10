

exports.createModel = function (type, content, from) {
    this.type = type || 0;
    this.content = content || "系统信息";
    this.from = from || "别人";
};
