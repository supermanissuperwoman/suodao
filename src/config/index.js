// 封装的接口地址

// const BASE_URL = "192.168.111.7";
// const WS_PORT = "8506";
// const BASE_URL = '47.101.177.0';
// const WS_PORT = '9000';
const BASE_URL = "47.100.48.219";
const WS_PORT = "9000";
const COMMON = "portal";
const WS_ADDRESS = `http://${BASE_URL}:${WS_PORT}`;
// 查询设备
const queryEquip = `${WS_ADDRESS}/${COMMON}/equipment/query`;
// 查询用户或项目的平均损伤值、损伤个数、运行时间、运行距离
const queryReportInfo = `${WS_ADDRESS}/${COMMON}/statistical/queryReportInfo`;
// 查询项目
const queryProject = `${WS_ADDRESS}/${COMMON}/project/query`;
// 查询用户
const queryUser = `${WS_ADDRESS}/${COMMON}/user/queryUser`;
// 用户登录
// const login = `${WS_ADDRESS}/${COMMON}/user/login`;
const login = `${WS_ADDRESS}/${COMMON}/user/login`;
// 用户、项目设备运行状态总数查询
const querySummaryCount = `${WS_ADDRESS}/${COMMON}/statistical/querySummaryCount`;
// 用户、项目下钢丝绳的风险等级汇总
const queryEquipmentSummaryStatus = `${WS_ADDRESS}/${COMMON}/statistical/queryEquipmentSummaryStatus`;
// 详情页面  设备运行里程
const queryEquipDistance = `${WS_ADDRESS}/${COMMON}/equipment/queryRunningDistanceInKM`;
// 详情页面  设备损伤监测结果
const queryEquipMonitorResult = `${WS_ADDRESS}/${COMMON}/equipment/queryMonitorResult`;
// 详情页面  设备监测概览
const queryRealtimeOverview = `${WS_ADDRESS}/${COMMON}/statistical/queryRealtimeOverview`;
// 详情页面 设备损伤量值
const queryDamageCount = `${WS_ADDRESS}/${COMMON}/statistical/queryDamageCount`;
// 详情页面 传感器和编码器数据
const queryRealtimeCache = `${WS_ADDRESS}/${COMMON}/statistical/queryRealtimeCache`;
// 详情页面 查询编码器行驶距离
const queryRealtimeRunningCache = `${WS_ADDRESS}/${COMMON}/statistical/queryRealtimeRunningCache`;
// 系统设置 添加联系人
const addProjectContactPerson = `${WS_ADDRESS}/${COMMON}/project/addProjectContactPerson`;
// 系统设置 联系人查询
const queryProjectContactPerson = `${WS_ADDRESS}/${COMMON}/project/queryProjectContactPerson`;
// 系统设置 删除联系人
const deleteProjectContactPerson = `${WS_ADDRESS}/${COMMON}/project/deleteProjectContactPerson`;
// 系统设置 修改密码
const updatePassword = `${WS_ADDRESS}/${COMMON}/user/updatePassword`;
// 多传感器 设备查询
const queryEquipmentInfo = `${WS_ADDRESS}/${COMMON}/harbor/queryEquipmentInfo`;
// 多传感器 损伤量值查询
const queryAllProcessSample = `${WS_ADDRESS}/${COMMON}/equipment/queryAllProcessSample`;
// 多传感器 设备状态
const queryProbeInfo = `${WS_ADDRESS}/${COMMON}/harbor/queryProbeInfo`;
// 统计报表日报查询数据接口
const queryImage = `${WS_ADDRESS}/scheduled/dailyReport/queryImage`;
// 统计报表下载图片接口
const queryDownloadImagePath = `${WS_ADDRESS}/scheduled/dailyReport/queryDownloadImagePath`;
// 统计报表的周报界面接口地址
const queryImageContent = `${WS_ADDRESS}/scheduled/weeklyReport/queryImageContent`;
// 查询系统教程菜单接口
const queryMenu = `${WS_ADDRESS}/${COMMON}/common/queryMenu`;
// 更新设备名称
const updateEquipmentName = `${WS_ADDRESS}/${COMMON}/equipment/update`;
// 查询系统教程内容
const queryMenuContent = `${WS_ADDRESS}/${COMMON}/common/queryMenuContent`;

const urlObj = {
  queryEquip: queryEquip,
  queryReportInfo: queryReportInfo,
  queryProject: queryProject,
  queryUser: queryUser,
  login: login,
  querySummaryCount: querySummaryCount,
  queryEquipmentSummaryStatus: queryEquipmentSummaryStatus,
  queryEquipDistance: queryEquipDistance,
  queryEquipMonitorResult: queryEquipMonitorResult,
  queryRealtimeOverview: queryRealtimeOverview,
  queryDamageCount: queryDamageCount,
  addProjectContactPerson: addProjectContactPerson,
  queryProjectContactPerson: queryProjectContactPerson,
  deleteProjectContactPerson: deleteProjectContactPerson,
  updatePassword: updatePassword,
  queryEquipmentInfo: queryEquipmentInfo,
  queryAllProcessSample: queryAllProcessSample,
  queryImage: queryImage,
  queryDownloadImagePath: queryDownloadImagePath,
  queryProbeInfo: queryProbeInfo,
  queryImageContent: queryImageContent,
  queryMenu: queryMenu,
  updateEquipmentName: updateEquipmentName,
  queryMenuContent: queryMenuContent,
  queryRealtimeCache: queryRealtimeCache,
  queryRealtimeRunningCache: queryRealtimeRunningCache,
};
export { urlObj };
