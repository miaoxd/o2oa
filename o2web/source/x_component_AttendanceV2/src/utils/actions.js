import {o2} from '@o2oa/component';


/**
 * 查询公共配置
 * @param {*} name 
 * @returns 
 */
function getPublicData(name){
  return new Promise((resolve)=>{
      o2.UD.getPublicData(name, dData=>resolve(dData));
  });
}
/**
 * 设置公共配置
 * @param {*} name 
 * @param {*} value 
 * @returns 
 */
function putPublicData(name, value){
  return new Promise((resolve)=>{
      o2.UD.putPublicData(name, value, dData=>resolve(dData));
  });
}

/**
 * 调用后端api 只返回data
 * @param {*} content 
 * @param {*} action 
 * @param {*} method 
 * @param  {...any} args 
 * @returns 
 */
async function doAction(content, action, method, ...args) {
  debugger;
  const m = o2.Actions.load(content)[action][method];
  const json = await m.apply(m, ...args);
  return json.data;
}
/**
 * 调用后端api 返回整个response对象
 * @param {*} content 
 * @param {*} action 
 * @param {*} method 
 * @param  {...any} args 
 * @returns 
 */
async function doActionBackResult(content, action, method, ...args) {
  debugger;
  const m = o2.Actions.load(content)[action][method];
  return await m.apply(m, ...args);
}
/**
 * 考勤班次API
 * @param {*} method 
 * @param  {...any} args 
 * @returns 
 */
function attendanceShiftAction(method, ...args) {
  return doAction('x_attendance_assemble_control', 'ShiftAction', method, args);
}
/**
 * 考勤班次分页查询
 * @param {*} method 
 * @param  {...any} args 
 * @returns 
 */
function shiftActionListByPaging( ...args) {
  return doActionBackResult('x_attendance_assemble_control', 'ShiftAction', "listByPaging", args);
}
/**
 * 考勤工作地址API
 * @param {*} method 
 * @param  {...any} args 
 * @returns 
 */
function attendanceWorkPlaceV2Action(method, ...args) {
  return doAction('x_attendance_assemble_control', 'WorkPlaceV2Action', method, args);
}

export { getPublicData, putPublicData, attendanceShiftAction, shiftActionListByPaging, attendanceWorkPlaceV2Action }