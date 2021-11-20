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
//根据歌曲id查询歌曲对象
export const getSongBySongId=(id) => get(`song/getSongBySongId?songId=${id}`);

//根据歌曲名查询歌曲对象
export const getSongBySongName=(songName) => get(`song/getSongBySongName?songName=${songName}`);

//-------------------歌单管理----------------
//查询歌单
export const getAllSongList=() => get(`songList/queryAllSongList`);
//添加歌单
export const setSongList=(params) => post(`songList/insertSongList`,params);

//更新歌单
export const updateSongList=(params) => post(`songList/updateSongList`,params);

//删除歌单
export const delSongList=(id) => get(`songList/deleteSongList?id=${id}`);

//-------------------歌单歌曲----------------
//根据歌单id查询歌曲列表
export const queryListSongById=(id) => get(`listSong/queryListSongById?songListId=${id}`);

//给歌单增加歌曲
export const insertListSong=(params) => post(`listSong/insertListSong`,params);
//删除歌单中的歌曲
export const deleteListSong=(songId,songListId) => get(`listSong/deleteListSong?songId=${songId}&songListId=${songListId}`);

//------------------用户管理--------------
//查询用户
export const getAllgetAllUser=() => get(`user/getAllUser`);
export const forbidUser=(forbidden,id) => post(`user/forbidUser?forbidden=${forbidden}&id=${id}`);

//----------------数据统计------------
export const getSongListCount=() => get(`songList/getSongListCount`);
export const getSingerCount=() => get(`singer/getSingerCount`);
export const getSongCount=() => get(`song/getSongCount`);