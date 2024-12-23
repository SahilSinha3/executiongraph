import type { GraphData } from '../types/graph';

export const sampleGraphData: GraphData =
{
  flowId: "agent-execution-flow-2024",
  flowCode: {
    groups: {
      "intent-detection": {
        id: "intent-detection-group",
        name: "Intent Detection",
        metadata: {
          icon: "⚙️",
          color: "#e1f5fe",
          borderColor: "#01579b"
        },
        nodes: [
          {
            id: "early-intent",
            type: "process",
            label: "Early Intent",
            metadata: {
              icon: "🧠",
              model: "GROQ 70B",
              time_taken: "0.45s",
              llm: {
                model: "GROQ-70B",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 1200
              }
            },
            connections: {
              next: ["doc-processing"],
              conditions: []
            }
          },
          {
            id: "doc-processing",
            type: "process",
            label: "Doc Processing",
            metadata: {
              icon: "📄",
              time_taken: "0.45s"
            },
            connections: {
              next: ["brand-intent"],
              conditions: []
            }
          },
          {
            id: "brand-intent",
            type: "process",
            label: "Brand Intent",
            metadata: {
              icon: "🎯",
              time_taken: "0.45s",
              llm: {
                model: "GPT-4",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 800
              }
            },
            connections: {
              next: ["search-terms"],
              conditions: []
            }
          }
        ]
      },
      "research": {
        id: "research-group",
        name: "Research",
        metadata: {
          icon: "🔍",
          color: "#f3e5f5",  // Light purple background
          borderColor: "#6a1b9a"  // Deep purple border
        },
        nodes: [
          {
            id: "search-terms",
            type: "agent",
            label: "Search Terms",
            metadata: {
              icon: "🔍",
              time_spent: "0.75s",
              llm: {
                model: "GPT-4",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 500
              }
            },
            connections: {
              next: ["keyword-search"],
              conditions: []
            }
          },
          {
            id: "keyword-search",
            type: "agent",
            label: "Keyword Search",
            metadata: {
              icon: "🔑",
              time_spent: "1.10s"
            },
            connections: {
              next: ["source-enrichment"],
              conditions: []
            }
          },
          {
            id: "source-enrichment",
            type: "agent",
            label: "Source Enrichment",
            metadata: {
              icon: "🕷️",
              time_spent: "7.00s"
            },
            connections: {
              next: ["smart-search"],
              conditions: []
            }
          },
          {
            id: "smart-search",
            type: "agent",
            label: "Smart Search",
            metadata: {
              icon: "🎯",
              time_spent: "8.24s",
              search: {
                providers: [
                  {
                    name: "Google",
                    icon: "https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                  },
                  {
                    name: "Facebook",
                    icon: "https://www.svgrepo.com/show/303114/facebook-3-logo.svg"
                  }
                ],
                searchCount: 4
              },
              llm: {
                model: "GPT-4",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 2000
              }
            },
            connections: {
              next: ["writer-helper"],
              conditions: [
                {
                  condition: "needsMoreData",
                  target: "source-enrichment"
                }
              ]
            }
          }
        ]
      },
      "ai-team": {
        id: "ai-team-group",
        name: "AI Team",
        metadata: {
          icon: "🤖",
          color: "#e8f5e9",
          borderColor: "#1b5e20"
        },
        nodes: [
          {
            id: "writer-helper",
            type: "agent",
            label: "Writer Helper",
            metadata: {
              icon: "✍️",
              time_spent: "10.50s",
              llm: {
                model: "GPT-4",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 3000
              }
            },
            connections: {
              next: ["compliance-assistant"],
              conditions: []
            }
          },
          {
            id: "compliance-assistant",
            type: "agent",
            label: "Compliance Assistant",
            metadata: {
              icon: "⚖️",
              time_spent: "12.30s",
              llm: {
                model: "GPT-4",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 1500
              }
            },
            connections: {
              next: ["audit-guide"],
              error: ["writer-helper"]
            }
          },
          {
            id: "audit-guide",
            type: "agent",
            label: "Audit Guide",
            metadata: {
              icon: "📋",
              time_spent: "6.00s"
            },
            connections: {
              next: ["content-finalizer"],
              conditions: []
            }
          },
          {
            id: "content-finalizer",
            type: "agent",
            label: "Content Finalizer",
            metadata: {
              icon: "✅",
              time_spent: "22.13s",
              llm: {
                model: "GPT-4",
                icon: "https://cdn.you.com/img/shared/chat-mode-switcher/models/gpt_4o.png",
                tokenCount: 4000
              }
            },
            connections: {
              next: ["end"],
              error: ["audit-guide"]
            }
          }
        ]
      }
    },
    controlNodes: {
      start: {
        id: "start",
        type: "start",
        label: "Execute Workflow",
        metadata: {
          icon: "🚀"
        },
        connections: {
          next: ["early-intent"]
        }
      },
      end: {
        id: "end",
        type: "end",
        label: "Execution Complete",
        metadata: {
          icon: "🏁"
        },
        connections: {
          next: []
        }
      }
    },
    metadata: {
      flowType: "agent-execution",
      version: "2.0",
      supportedFeatures: [
        "conditional-branching",
        "error-handling",
        "loops",
        "group-based-execution"
      ]
    }
  }
};