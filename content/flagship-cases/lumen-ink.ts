import type { FlagshipCaseStudy } from "./types";

export const lumenInkCase: FlagshipCaseStudy = {
  slug: "lumen-ink",
  overview: {
    oneLine: "把一次性图像生成收敛为有任务状态、Provider 边界、结果复核和历史回看的专业工作台。",
    responsibility: "负责产品定义、交互设计、Provider 抽象、任务与持久化边界、全栈 MVP 和真实编辑验证。",
    status: "Live Demo｜真实 Provider 编辑已验证",
    boundary: "仅 Seedream 4.5 文生图与图生图两项操作完成真实验证；液化、修复、消除及其他模式仍未验证。",
    claimIds: [
      "LUMEN-PROVIDER-COUNT",
      "LUMEN-TOOL-COUNT",
      "LUMEN-PROMPT-SECTIONS",
      "LUMEN-ABSTRACTION-COUNT",
      "LUMEN-EDIT-VERIFY",
    ],
  },
  business: {
    whyBuild: "专业图像工作需要保留人物特征、控制修改范围并能回看结果，一次性提示词难以支持稳定复用和责任追踪。",
    signals: [
      {
        title: "专业要求难以表达",
        detail: "身份锚定、特征保留、光影、镜头和风格约束需要结构化输入，而不是一句自然语言。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
      {
        title: "供应商差异会泄漏到体验",
        detail: "不同模型的鉴权、参数、错误和结果格式不同，直接耦合会让用户承担底层复杂性。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
    ],
    judgments: [
      {
        title: "先验证窄而真的编辑路径",
        detail: "在扩大工具声明前，先让一个真实 Provider 的核心生成和编辑链路可运行、可核验。",
        evidenceRefs: ["E-LUMEN-EDIT"],
      },
      {
        title: "任务历史是核心产品能力",
        detail: "可恢复任务、结果复核和版本回看比一次生成更多模型选项更接近专业工作流。",
        evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-PRODUCTION"],
      },
    ],
    constraints: [
      "真实验证仅覆盖文生图与图生图。",
      "未验证工具不得从界面存在推导为在线可用。",
      "公开体验不得泄露模型密钥或把未授权请求包装成成功。",
    ],
  },
  product: {
    form: "包含结构化提示、生成/编辑任务、结果复核和历史记录的 AI 图像工作台。",
    users: ["摄影与后期人员", "需要预览效果的客户", "维护模型接入的产品与工程人员"],
    workflow: [
      {
        title: "建立任务",
        detail: "选择任务类型并用结构化提示描述身份、修改范围和风格约束。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
      {
        title: "调用 Provider",
        detail: "任务通过统一适配层进入选定模型，并记录状态、错误和结果。",
        evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-EDIT"],
      },
      {
        title: "复核与回看",
        detail: "用户检查输出、保留结果或回到历史任务，而不是把生成结果视为不可追踪的一次性响应。",
        evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-PRODUCTION"],
      },
    ],
    decisions: [
      {
        title: "采用专业工作台心智",
        detail: "使用画布、工具、参数和历史区域，而不是把所有操作压缩到聊天框。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
      {
        title: "能力声明跟随验证状态",
        detail: "界面可展示未来工具，但公开证据只把已真实调用的两项操作标记为已验证。",
        evidenceRefs: ["E-LUMEN-EDIT"],
      },
    ],
    nonGoals: [
      "不宣称所有模型和工具已通过同等真实验证。",
      "不把健康检查通过等同于完整编辑质量验证。",
      "不在公开页面嵌入或保存用户模型密钥。",
    ],
  },
  technical: {
    architecture: [
      {
        title: "Workbench → Task",
        detail: "前端操作生成可追踪任务，任务状态与界面状态分离。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
      {
        title: "Provider adapter → Result/history",
        detail: "统一适配鉴权、请求、错误和结果，成功输出进入可回看的任务历史。",
        evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-EDIT"],
      },
    ],
    mechanisms: [
      {
        title: "Provider adapter",
        detail: "用统一接口隔离模型供应商差异，并保留专有参数的扩展入口。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
      {
        title: "Task state and recovery",
        detail: "任务记录创建、处理中、成功和失败状态，为重试与历史回看提供基础。",
        evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-PRODUCTION"],
      },
      {
        title: "Authorization and error mapping",
        detail: "空请求和未授权项目返回明确错误，不把鉴权失败降级成伪成功。",
        evidenceRefs: ["E-LUMEN-PRODUCTION"],
      },
    ],
    tradeoffs: [
      {
        title: "统一抽象与模型特性",
        detail: "统一高频能力以降低前端复杂度，同时保留供应商特有能力的受控扩展。",
        evidenceRefs: ["E-LUMEN-SOURCE"],
      },
      {
        title: "公开体验与密钥责任",
        detail: "采用边界清晰的鉴权与 Provider 配置，换取更安全的真实链路验证。",
        evidenceRefs: ["E-LUMEN-EDIT", "E-LUMEN-PRODUCTION"],
      },
    ],
  },
  iterations: [
    {
      version: "Local workbench",
      trigger: "需要验证专业修图需求能否被产品化。",
      productChange: "建立结构化提示、画布、工具和历史区。",
      technicalChange: "完成 Provider 抽象和本地任务流。",
      result: "工作台核心交互和本地测试闭合。",
      boundary: "尚未证明云端读写与真实 Provider。",
      evidenceRefs: ["E-LUMEN-LOCAL", "E-LUMEN-SOURCE"],
    },
    {
      version: "Preview read path",
      trigger: "需要验证云环境到持久化层的基础连接。",
      productChange: "增加只读诊断和明确的受限状态。",
      technicalChange: "完成 Preview 探针和数据库读取验证。",
      result: "云端只读路径可用。",
      boundary: "只读通过不代表编辑链路完成。",
      evidenceRefs: ["E-LUMEN-PREVIEW"],
    },
    {
      version: "Production health and auth",
      trigger: "需要确认公开入口、健康状态和授权边界。",
      productChange: "公开页面显示真实服务状态和失败反馈。",
      technicalChange: "核验根页、健康接口和未授权请求。",
      result: "生产入口与授权边界完成受控验证。",
      boundary: "仍未证明具体编辑操作。",
      evidenceRefs: ["E-LUMEN-PRODUCTION"],
    },
    {
      version: "Seedream real edit",
      trigger: "需要用真实 Provider 闭合最小编辑证据。",
      productChange: "把文生图和图生图标记为已验证路径。",
      technicalChange: "通过统一编辑接口调用 Seedream 4.5 并核对响应。",
      result: "两项核心操作完成真实验证。",
      boundary: "液化、修复、消除和其他模式仍关闭声明。",
      evidenceRefs: ["E-LUMEN-EDIT"],
    },
  ],
  evidenceIds: [
    "lumen-workbench",
    "lumen-provider-boundary",
    "lumen-edit-verification",
    "lumen-live-entry",
    "lumen-live-demo",
  ],
};
