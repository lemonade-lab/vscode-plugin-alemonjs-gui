/**
 * 频道： 增加、删除、更新。
 * 子频道： 增加、删除、更新。
 *
 * 用户： 增加、删除、更新。
 *
 * 用户信息：用户编号(新增时生产)、用户名称、用户头像、是否是主人、是否是机器人。
 *
 * 有一个默认的用户信息：即alemonjs机器人。
 *
 * 连接配置： 服务器地址、端口。
 *
 */

import { useState } from 'react';

/**
 *
 * @returns
 */
export default function App({
  config,
  setConfig,
  onClickConfigSave
}: {
  config: { host: string; port: string };
  setConfig: (config: { host: string; port: string }) => void;
  onClickConfigSave: () => void;
}) {
  const USER_URI = 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638';

  const [show, setShow] = useState(false);

  return (
    <section className="relative h-full flex flex-col gap-2 shadow-content p-2">
      {
        // 连接配置
        // 直接输入服务器地址和端口
      }
      <div className="flex  flex-col sm:flex-row  gap-2 ">
        <div className=" md:flex-1 flex flex-col gap-2 py-2 border-y px-1 rounded-md">
          <div>连接配置</div>
          <input
            type="text"
            value={config.host}
            onChange={e => setConfig({ ...config, host: e.target.value })}
            className="min-w-0 outline-none bg-opacity-0 px-3 py-1 rounded-md border border-opacity-70"
            placeholder="host"
          />
          <input
            type="number"
            value={config.port}
            onChange={e => setConfig({ ...config, port: e.target.value })}
            className="min-w-0 outline-none bg-opacity-0 px-3 py-1 rounded-md border border-opacity-70"
            placeholder="port"
          />
          <button
            onClick={onClickConfigSave}
            className="px-2 flex items-center cursor-pointer rounded-md border py-1 hover:bg-gray-100 bg-opacity-70 justify-center"
          >
            保存
          </button>
        </div>

        {
          // 用户配置
        }
        <div className="md:flex-1 flex flex-col gap-2 py-2 border-y px-1 rounded-md">
          <div>用户列表</div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-3 px-2 py-1  cursor-pointer ">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full "
                  src={USER_URI}
                  alt="Avatar"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="font-semibold">柠檬冲水</div>
                <div className="text-sm text-gray-500">2024-12-25</div>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <button
                className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70"
                onClick={() => setShow(!show)}
              >
                编辑
              </button>
              <button className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      {show && (
        <div className="flex flex-col gap-2 py-2 border-y px-1 rounded-md">
          <div>用户配置</div>
          <input
            type="text"
            className="min-w-0 outline-none bg-opacity-0 px-3 py-1 rounded-md border border-opacity-70"
            placeholder="用户昵称"
          />
          <input
            type="text"
            className="min-w-0 outline-none bg-opacity-0 px-3 py-1 rounded-md border border-opacity-70"
            placeholder="用户头像"
          />
        </div>
      )}
    </section>
  );
}
