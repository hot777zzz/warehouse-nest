import { Injectable } from '@nestjs/common';
import { ResultData } from 'src/common/utils/result';
import { SUCCESS_CODE } from 'src/common/utils/result';
import { UserService } from '../system/user/user.service';
import { LoginlogService } from '../monitor/loginlog/loginlog.service';
import { AxiosService } from 'src/module/common/axios/axios.service';
import { RegisterDto, LoginDto } from './dto/index';
import { MenuService } from '../system/menu/menu.service';
import { ClientInfoDto } from 'src/common/decorators/common.decorator';
@Injectable()
export class MainService {
  constructor(
    private readonly userService: UserService,
    private readonly loginlogService: LoginlogService,
    private readonly axiosService: AxiosService,
    private readonly menuService: MenuService,
  ) {}

  /**
   * 登陆
   * @param user
   * @returns
   */
  async login(user: LoginDto, clientInfo: ClientInfoDto) {
    const loginLog = {
      ...clientInfo,
      status: '0',
      msg: '',
    };
    try {
      const loginLocation = await this.axiosService.getIpAddress(clientInfo.ipaddr);
      loginLog.loginLocation = loginLocation;
    } catch (error) {}
    const loginRes = await this.userService.login(user, loginLog);
    loginLog.status = loginRes.code === SUCCESS_CODE ? '0' : '1';
    loginLog.msg = loginRes.msg;

    if (loginRes.data && loginRes.data.userName) {
      loginLog.userName = loginRes.data.userName;
      delete loginRes.data.userName;
    }
    this.loginlogService.create(loginLog);

    return loginRes;
  }
  /**
   * 退出登陆
   * @param clientInfo
   */
  async logout(clientInfo: ClientInfoDto) {
    const loginLog = {
      ...clientInfo,
      status: '0',
      msg: '退出成功',
    };
    try {
      const loginLocation = await this.axiosService.getIpAddress(clientInfo.ipaddr);
      loginLog.loginLocation = loginLocation;
    } catch (error) {}
    this.loginlogService.create(loginLog);
    return ResultData.ok();
  }
  /**
   * 注册
   * @param user
   * @returns
   */
  async register(user: RegisterDto) {
    return await this.userService.register(user);
  }

  /**
   * 登陆记录
   */
  loginRecord() {}

  /**
   * 获取路由菜单
   */
  async getRouters(userId: number) {
    const allMenus = await this.menuService.getMenuListByUserId(userId);

    // 查找仓库管理菜单
    const warehouseMenu = allMenus.find((menu) => menu.path === '/warehouse');

    if (warehouseMenu && warehouseMenu.children) {
      // 提取仓库管理的子菜单作为顶级菜单
      const topLevelMenus = [];

      // 添加首页作为顶级菜单
      const homeMenu = allMenus.find((menu) => menu.path === '/' || (menu.meta && menu.meta.title === '首页'));
      if (homeMenu) {
        topLevelMenus.push(homeMenu);
      }

      // 将仓库管理的子菜单作为顶级菜单添加，并修改路径为顶级路径
      for (const child of warehouseMenu.children) {
        // 确保子菜单显示为顶级菜单项
        const topLevelChild = { ...child };
        topLevelChild.parentId = 0;

        // 修改路径为顶级路径，去掉 '/warehouse' 前缀
        if (topLevelChild.path.startsWith('/warehouse/')) {
          topLevelChild.path = `/${topLevelChild.path.substring(11)}`; // 移除 '/warehouse/' 前缀
        } else if (topLevelChild.path === '/warehouse') {
          topLevelChild.path = '/'; // 如果路径是 '/warehouse'，则改为 '/'
        }

        // 确保组件路径正确
        if (topLevelChild.component && !topLevelChild.component.startsWith('warehouse/')) {
          topLevelChild.component = `warehouse/${topLevelChild.component}`;
        }

        topLevelMenus.push(topLevelChild);
      }

      return ResultData.ok(topLevelMenus);
    } else {
      // 如果没有仓库管理菜单，至少返回首页
      const homeMenu = allMenus.find((menu) => menu.path === '/' || (menu.meta && menu.meta.title === '首页'));
      if (homeMenu) {
        return ResultData.ok([homeMenu]);
      }
    }

    // 如果什么都找不到，返回空数组
    return ResultData.ok([]);
  }
}
