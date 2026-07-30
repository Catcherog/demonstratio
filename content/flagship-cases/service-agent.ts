import type { FlagshipCaseStudy } from "./types";

export const serviceAgentCase: FlagshipCaseStudy = {
  slug: "service-agent",
  overview: {
    oneLine: "用风险优先的 Agent 工作流，在可回答、应澄清、应拒答和应转人工之间建立确定性边界。",
    responsibility: "负责场景与风险定义、Agent 工作流、检索与质量 Gate、评测方案、Demo 体验和迭代闭环。",
    status: "公网实时 Demo｜受控生产验证",
    boundary: "公网前端已接入 CloudBase Deploy 039 后端并完成受控 E2E 验证；安全结论仍为 provisional，延迟、可用性和知识覆盖仍需生产加固。",
    claimIds: [
      "SCS-WORKFLOW-SHAPE",
      "SCS-REGRESSION-COUNT",
      "SCS-RISK-TAXONOMY",
      "SCS-SCENARIO-TAXONOMY",
      "SCS-AUDIT-DATASET",
      "SCS-DEPLOYED-SHA",
      "SCS-R2-EVAL-DIMENSIONS",
    ],
  },
  business: {
    whyBuild: "影像工作室的咨询既需要快速获取营业、地址和服务信息，也包含价格、档期、健康风险和未知问题；单纯追求自动回复会放大错误承诺成本。",
    signals: [
      {
        title: "普通咨询需要证据",
        detail: "营业时间、地址和流程类问题应给出带来源的可用回答，而不是只返回模板或泛化话术。",
        evidenceRefs: ["E-SCS-SOURCE", "E-SCS-DEPLOY-039"],
      },
      {
        title: "高风险问题不能被 Demo 模式放宽",
        detail: "部署回归暴露出展示模式覆盖人工确认条件的问题，说明安全边界必须独立于体验模式。",
        evidenceRefs: ["E-SCS-DEPLOY-031", "E-SCS-DEPLOY-032", "E-SCS-DEPLOY-039"],
      },
    ],
    judgments: [
      {
        title: "转人工质量也是产品结果",
        detail: "对于高风险、证据不足或超出知识范围的问题，正确转交比生成一个流畅答案更有价值。",
        evidenceRefs: ["E-SCS-SOURCE", "E-SCS-R2-EVAL"],
      },
      {
        title: "评测必须拆维度",
        detail: "路由、检索证据、上下文支持、安全门禁和生成输出不能被一个总分替代。",
        evidenceRefs: ["E-SCS-R2-EVAL", "E-SCS-EVAL-RUNNER"],
      },
    ],
    constraints: [
      "公网前端已接入 CloudBase 后端，但安全结论仍为 provisional，不主张生产 SLO。",
      "工程回归计数不能解释为回答准确率。",
      "生产观察显示可用性、延迟和知识覆盖仍需优化。",
    ],
  },
  product: {
    form: "受控咨询场景、证据化回答、人工接管和知识缺口回收组成的客服 Agent。",
    users: ["咨询客户", "客服与运营人员", "负责知识审核的业务负责人", "维护 Agent 的产品与工程人员"],
    workflow: [
      {
        title: "B1 · 可支持的普通咨询",
        detail: "检索到足够证据且上下文支持时生成答案，并展示来源模块。",
        evidenceRefs: ["E-SCS-DEPLOY-039"],
      },
      {
        title: "B2 · 高风险咨询",
        detail: "价格、健康和确定性承诺等场景由硬风险规则与人工确认 Gate 阻断自动回答。",
        evidenceRefs: ["E-SCS-SOURCE", "E-SCS-DEPLOY-039"],
      },
      {
        title: "B3 · 未支持问题",
        detail: "检索证据不足或问题超出知识范围时转人工，并把知识缺口留给后续治理。",
        evidenceRefs: ["E-SCS-DEPLOY-039"],
      },
    ],
    decisions: [
      {
        title: "把 LLM 建议设为 advisory-only",
        detail: "展示模式中的 LLM 建议不能覆盖确定性硬风险与 needs_human_confirm。",
        evidenceRefs: ["E-SCS-DEPLOY-039"],
      },
      {
        title: "前后端可用性分开表达",
        detail: "公网前端已接入 CloudBase 后端并完成受控 E2E 验证；静态降级作为备用模式保留，不替代真实后端验证。",
        evidenceRefs: ["E-SCS-PRODUCTION", "E-SCS-DEPLOY-039"],
      },
    ],
    nonGoals: [
      "不追求所有问题自动回答。",
      "不把离线图级评测换算成线上回答质量。",
      "不主张生产 SLO 或全面上线。",
    ],
  },
  technical: {
    architecture: [
      {
        title: "LangGraph 工作流",
        detail: "输入经过意图与风险判断、查询解析、检索、生成、质量检查、人工接管与反馈回收。",
        evidenceRefs: ["E-SCS-SOURCE"],
      },
      {
        title: "证据与上下文双 Gate",
        detail: "检索证据充分性代理信号与 supported_by_context 共同约束回答支持度，避免把非空检索误当成语义支持。",
        evidenceRefs: ["E-SCS-DEPLOY-039"],
      },
    ],
    mechanisms: [
      {
        title: "N03.5 查询解析",
        detail: "用多轮上下文消解省略和指代，生成 original_query、rewritten_query 和可审计的检索输入。",
        evidenceRefs: ["E-SCS-SOURCE", "E-SCS-DEPLOY-039"],
      },
      {
        title: "Multi-query retrieval",
        detail: "将原问题、改写问题和关键词补全作为候选查询，聚合并去重检索结果。",
        evidenceRefs: ["E-SCS-SOURCE"],
      },
      {
        title: "R0–R3 fail-closed policy",
        detail: "确定性硬风险、人工确认需求和支持度检查按优先级进入回答或人工接管。",
        evidenceRefs: ["E-SCS-SOURCE", "E-SCS-DEPLOY-039"],
      },
    ],
    tradeoffs: [
      {
        title: "安全优先于自动化率",
        detail: "接受更多人工接管，换取敏感场景不被 Demo 模式或模型建议放宽。",
        evidenceRefs: ["E-SCS-DEPLOY-039"],
      },
      {
        title: "可解释降级优先于伪实时",
        detail: "后端或前端依赖不完整时仍提供静态受控场景，并显式展示边界。",
        evidenceRefs: ["E-SCS-PRODUCTION"],
      },
    ],
  },
  iterations: [
    {
      version: "Controlled Demo · 静态基线",
      trigger: "需要先让招聘方理解 B1/B2/B3 和安全边界。",
      productChange: "提供三类受控场景与静态降级。",
      technicalChange: "前端在后端不可用时避免裸错误页。",
      result: "公开入口可解释、可浏览。",
      boundary: "不调用当前 CloudBase 后端。",
      evidenceRefs: ["E-SCS-PRODUCTION"],
    },
    {
      version: "Deploy 028 · 安全基线",
      trigger: "需要恢复可运行后端并保持 fail-closed。",
      productChange: "限定普通咨询和人工接管路径。",
      technicalChange: "恢复知识检索与风险 Gate。",
      result: "形成后续回归比较基线。",
      boundary: "仍需验证多轮查询和生产表现。",
      evidenceRefs: ["E-SCS-SOURCE"],
    },
    {
      version: "Deploy 031 / 032 · 回归发现",
      trigger: "公网验证发现高风险问题被回答。",
      productChange: "把高风险误放定义为阻塞缺陷。",
      technicalChange: "定位 public_demo 覆盖人工确认和风险策略的问题。",
      result: "问题被复现并禁止发布。",
      boundary: "这两个部署已被后续版本替代。",
      evidenceRefs: ["E-SCS-DEPLOY-031", "E-SCS-DEPLOY-032"],
    },
    {
      version: "Deploy 039 · Phase G",
      trigger: "需要闭合多轮检索、支持度和高风险回归。",
      productChange: "明确支持回答、人工接管和知识缺口三类结果。",
      technicalChange: "修复查询解析、双 Gate 和展示模式策略优先级。",
      result: "Phase G 已验证，后端保持在线。",
      boundary: "安全为 provisional，前端切换和生产加固尚未完成。",
      evidenceRefs: ["E-SCS-DEPLOY-039"],
    },
    {
      version: "Live Recovery · 公网实时 Demo 接入",
      trigger: "需要把公网前端从静态降级切换到已验证的 CloudBase 后端。",
      productChange: "前端 Live 模式开放真实问答，静态 B1/B2/B3 仅作为备用模式保留。",
      technicalChange: "Vercel 环境变量切换到 live + 真实后端地址；代理超时从 20s 调整到 40s 适配后端 P50 延迟。",
      result: "公网 Demo 完成受控浏览器 E2E：多轮追问、来源展示、高风险转人工、无知识拒答。",
      boundary: "安全仍为 provisional，反馈接口联调为非阻塞债务。",
      evidenceRefs: ["E-SCS-PRODUCTION", "E-SCS-DEPLOY-039"],
    },
    {
      version: "Production hardening · 进行中",
      trigger: "生产观察暴露延迟、无响应和知识覆盖问题。",
      productChange: "建立可用性、性能和知识缺口的持续运营指标。",
      technicalChange: "补充可观测性、延迟优化和 KB 扩充。",
      result: "尚未闭合。",
      boundary: "不能把后端在线等同于稳定生产服务。",
      evidenceRefs: ["E-SCS-DEPLOY-039"],
    },
  ],
  evidenceIds: [
    "service-agent-risk-workflow",
    "service-agent-phase-g-summary",
    "service-agent-controlled-demo",
    "service-agent-live-frontend",
    "service-agent-walkthrough",
  ],
};
