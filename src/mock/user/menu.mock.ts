import type { MenuList } from '@/interface/layout/menu.interface';

import { intercepter, mock } from '../config';

const mockMenuList = [
  {
      code: "dashboard",
      label: {
          zh_CN: "首页",
          en_US: "Dashboard",
          th_TH: "แดชบอร์ด",
      },
      icon: "dashboard",
      path: "/dashboard",
  },
  {
      code: "newplayerstatistics",
      label: {
          zh_CN: "新玩家统计",
          en_US: "New Player Statistics",
          th_TH: "สถิติผู้เล่นใหม่",
      },
      icon: "transaction",
      path: "/new-player-statistics",
  },
  {
      code: "playerstats",
      label: {
          zh_CN: "球员统计数据",
          en_US: "Player Stats",
          th_TH: "สถิติผู้เล่น",
      },
      icon: "transaction",
      path: "/player-stats",
  },
  {
      code: "subagentmanagement",
      label: {
          zh_CN: "权限",
          en_US: "Sub Agents",
          th_TH: "ตัวแทนย่อย",
      },
      icon: "permission",
      path: "/sub-agent",
      children: [
          {
              code: "subAgentManage",
              label: {
                  zh_CN: "路由权限",
                  en_US: "Manage",
                  th_TH: "จัดการ",
              },
              path: "/sub-agent/manage",
          },
          // Additional children can be similarly translated
      ],
  },
  {
      code: "report",
      label: {
          zh_CN: "权限",
          en_US: "Report",
          th_TH: "รายงาน",
      },
      icon: "permission",
      path: "/report",
      children: [
          {
              code: "win-loss-reports",
              label: {
                  zh_CN: "赢/输报告",
                  en_US: "Win/Loss Reports",
                  th_TH: "รายงานผลชนะ/แพ้",
              },
              path: "/report/win-loss",
          },
      ],
  },
  {
      code: "history",
      label: {
          zh_CN: "历史",
          en_US: "History",
          th_TH: "ประวัติ",
      },
      icon: "permission",
      path: "/history",
      children: [
          {
              code: "history-bets",
              label: {
                  zh_CN: "投注历史",
                  en_US: "Bets History",
                  th_TH: "ประวัติการเดิมพัน",
              },
              path: "/history/bets",
          },
      ],
  },
  {
      code: "member",
      label: {
          zh_CN: "成员",
          en_US: "Member",
          th_TH: "สมาชิก",
      },
      icon: "permission",
      path: "/member",
      children: [
          {
              code: "member-management",
              label: {
                  zh_CN: "会员管理",
                  en_US: "Member Management",
                  th_TH: "การจัดการสมาชิก",
              },
              path: "/member/management",
          },
      ],
  },
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));