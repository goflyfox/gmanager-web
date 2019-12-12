module.exports = {

  title: '配置管理平台',

  /**
   * 分页参数
   */
  pageParams: {
    pageSizes: [1, 10, 20, 50, 100], // 分页下拉框
    pageSize: 10, // 分页默认条数
    currentPage: 1, // 默认页数
    total: 1 // 默认总条数
  },

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false
}
