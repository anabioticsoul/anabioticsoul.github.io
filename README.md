

IR intermediate representation

Troubleshooting 故障排除

- Whole-program 全程序：分析全程序的指向关系。
- Demand-driven 需求驱动：只分析影响特定域的指针的指向关系。



Class hierarchy analysis (CHA)

Rapid type analysis (RTA)

Variable type analysis (VTA)

Pointer analysis (k-CFA)



context-free language (CFL）

Context-Free Grammar (CFG)



monitoring tools

- profiling

- tracing

- logging



- MOD: The set of variables possibly modified (defined) by a call to a 
  procedure 
- REF: The set of variables possibly read (used) by a call to a procedure 
- DEF: The set of variables that are definitely defined by a procedure (e.g., 
  killed in the liveness sense) 





##### PeerPressure

snapshot 快照

multi-gene troubleshooting 多基因故障排除



##### Triage

onsite diagnosis 现场诊断

postmortem analysis  事后分析

post-hoc diagnosis 事后诊断

analysis post-hoc 事后分析

delta generation 增量生成

delta analysis 增量分析

Core dump analysis 核心转储分析

speculative execution 投机执行 ( skipping some code, modifying variables )



##### ConfAid



dynamic information flow analysis 动态信息流分析

- Taint tracking 污点跟踪
- instrumentation



##### X-ray

taint tracking 污点跟踪

replay 重放

 performance summarization 性能摘要



##### Sherlog

 postmortem error diagnosis 事后错误分析

satisfiability constraint solver 可满足约束求解器

log-driven

summary-based



##### ConfAnalyser

static single assignment 静态单赋值

points-to analysis 指向分析

call-graph 调用图

dataflow analysis 数据流分析

static analysis 静态分析

failure-context-sensitive analysis 故障上下文敏感分析

dynamic analysis 动态分析

 taint tracking 污点跟踪

k-object-sensitive points-to analysis k对象敏感指向分析

object-sensitive dataflow analysis 对象敏感的数据流分析

summary-based context-sensitive analysis 基于摘要的上下文敏感分析

method-local control-flow analysis 方法局部控制流分析

static control-dependence analysis 静态控制依赖分析

thin slicing 薄切片



##### ConfDiagnoser

predicate 谓词

instrumentation 插桩

Propagation Analysis 传播分析

Deviation Analysis 偏离分析

Behavior Profiling 行为概要

execution profile 执行概要

offline instrumentation 离线插桩



##### ConfDebugger





##### ConfDoctor

configuration propagation analysis 配置传播分析

backward slicing analysis 后向切片分析



##### PCHECK

inter-procedual context sensitive field sensitive

taint tracking

summary-based



##### CROSS-STACK



##### LOTRACK

configuration map 配置映射

SMT solver SMT求解器



##### Towards Continuous Access Control Validation and Forensics

forensic analysis 取证分析

