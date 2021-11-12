import {get,post} from './http';
//--------------歌手管理----------------
//判断管理员是否登陆成功
export const getLoginStatus = (params) => post(`admin/login/status`,params);

//查询歌手
export const getAllSinger=() => get(`singer/queryAllSinger`);
//添加歌手
export const setSinger=(params) => post(`singer/insertSinger`,params);

//更新歌手
export const updateSinger=(params) => post(`singer/updateSinger`,params);

//删除歌手
export const delSinger=(id) => get(`singer/deleteSinger?id=${id}`);


//-------------------歌曲管理----------------
//根据歌手id查询歌曲
export const querySongsBySingerId=(id) => get(`song/getSongBySingerId?singerId=${id}`);
//更新歌曲
export const updateSong=(params) => post(`song/updateSong`,params);
//删除歌曲
export const delSong=(id) => get(`song/deleteSong?id=${id}`);