import { useState } from 'react';

/**
 * 频道： 增加、删除、更新。
 * 子频道： 增加、删除、更新。
 *
 * 用户： 增加、删除、更新。
 *
 * 用户信息：用户编号(新增时生产)、用户名称、用户头像、是否是主人、是否是机器人。
 *
 * // 有一个默认的用户信息：即alemonjs机器人。
 *
 * 连接配置： 服务器地址、端口。
 *
 */

/**
 *
 * @returns
 */
export default function App() {
  /**
   * 点击按钮后，出现表单。
   * 用来添加、删除、更新用户
   */
  const [select, setSelect] = useState<'add' | 'delete' | 'update'>('add');
  const onClickConnect = () => {
    console.log('connect');
  };
  const onClickDisconnect = () => {
    console.log('disconnect');
  };

  return (
    <section className="relative h-full flex flex-col shadow-content p-2">
      {
        // 用户配置
      }
      <div className="flex flex-row gap-2 py-2">
        <button className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70">
          添加
        </button>
        <button className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70">
          删除
        </button>
        <button className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70">
          更新
        </button>
      </div>
      {
        // 用户列表
      }
      <div className="flex flex-col gap-2 py-2">
        <input
          type="text"
          className="min-w-0 outline-none bg-opacity-0 px-3 rounded-md border border-opacity-70"
          placeholder="用户昵称"
        />
        <input
          type="text"
          className="min-w-0 outline-none bg-opacity-0 px-3 rounded-md border border-opacity-70"
          placeholder="用户头像"
        />
      </div>
      {
        // 连接配置
        // 直接输入服务器地址和端口
      }
      <div className="flex flex-row gap-2 py-2">
        <input
          type="text"
          className="min-w-0 outline-none bg-opacity-0 px-3 rounded-md border border-opacity-70"
          placeholder="服务器地址"
        />
        <input
          type="text"
          className="min-w-0 outline-none bg-opacity-0 px-3 rounded-md border border-opacity-70"
          placeholder="端口"
        />
      </div>
    </section>
  );
}
