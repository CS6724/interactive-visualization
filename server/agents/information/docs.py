from typing import Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableMap
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader, TextLoader

from shared import State, get_prompts
from helpers import get_agent


AGENT_KEY = "information_docs"


class DocsAgent:
    class DocsQuery:
        """Optional tool class if you plan to extend LLM to return tool-structured output."""
        pass

    def __init__(self):
        self.llm = get_agent(AGENT_KEY)
        self.prompt = get_prompts(AGENT_KEY)
        self.graph = self._build_graph()

    def _get_loader(self, loader_type: str):
        if loader_type == "url":
            return lambda value: WebBaseLoader(value).load()
        elif loader_type == "pdf":
            return lambda value: PyPDFLoader(value).load()
        elif loader_type == "txt":
            return lambda value: TextLoader(value).load()
        else:
            raise ValueError(f"Unsupported docs_source_type: {loader_type}")

    def _build_query_gen(self):
        return (
            RunnableMap({
                "docs_query": lambda s: s["docs_query"],
                "context": lambda s: s.get("context", []),
            })
            | self.prompt
            | self.llm
        )

    def _query_gen_node(self, state: dict):
        result = self.query_gen.invoke(state)
        state["docs_summary"] = result.content if hasattr(result, "content") else str(result)
        return state

    def _load_docs_node(self, state: dict):
        loader = self._get_loader(state["docs_source_type"])
        try:
            documents = loader(state["docs_source"])
            state["docs"] = documents
        except Exception as e:
            state["docs"] = []
            state["docs_summary"] = f"Error loading documents: {str(e)}"
        return state

    def _extract_final(self, state: dict):
        content = state.get("docs_summary") or "No summary available."
        state["final_result"] = content
        return state

    def _build_graph(self):
        self.query_gen = self._build_query_gen()

        sg = StateGraph(dict)
        sg.add_node("load_docs", self._load_docs_node)
        sg.add_node("query_docs", self._query_gen_node)
        sg.add_node("final", self._extract_final)

        sg.add_edge(START, "load_docs")
        sg.add_edge("load_docs", "query_docs")
        sg.add_edge("query_docs", "final")
        sg.add_edge("final", END)
        return sg.compile()


def information_docs_node(state: State) -> State:
    query = state["docs_query"][-1] if isinstance(state["docs_query"], list) else state["docs_query"]
    if query == "PASS":
        state["docs_response"] = ""
        return state

    agent = DocsAgent()
    result = agent.graph.invoke({
        "docs_query": state["docs_query"],
        "docs_source": state["docs_source"],
        "docs_source_type": state["docs_source_type"],
        "context": []
    })

    state["docs_response"] = AIMessage(content=result["final_result"])
    return state