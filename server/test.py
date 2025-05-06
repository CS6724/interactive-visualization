from agents.graph import graph,main
from langchain_core.messages import BaseMessage,HumanMessage
from dotenv import load_dotenv
load_dotenv()

def safe_get_content(value, label):
    if isinstance(value, list) and value:
        return value[-1].content
    if isinstance(value, BaseMessage):
        return value.content
    return f"{label}: PASS or not applicable"

if __name__ == "__main__":
    # Full =  "WHich class is the largest in terms of number of methods and properties and when was it last modified?"
    # Full = Who modified the selected class last? What was the commit message
    # Git =  "Who modified the project last ?"
    # Source = "Which class has the top most methods?"
    # GitHub = "What is the most recent issue that needs fixing"
    # Docs = "What does this project do"
    # result = main("What does this project do")
    result = graph.invoke({
        'project_name': 'keycloak', 
        'user_query': [HumanMessage(content='What does this class do?', additional_kwargs={}, response_metadata={})], 
        'source_db': 'uml-data', 
        'repository_path': '/Users/yoseph/Work/Personal/keycloak', 
        'github_url': 'keycloak/keycloak', 
        'docs_source': 'https://www.keycloak.org/documentation', 
        'context': [HumanMessage(content="User is currently viewing diagrams of Classes in junit.rules.freedesktop.dbus.transport.jre"),
                    HumanMessage(content="User Selected ['org.freedesktop.dbus.transport.jre.NativeTransportProvider']")]})
    # print("Information:")
    # print(f"    User Query: {safe_get_content(result.get('user_query'), 'User Query')}")
    # print(f"    Source Query: {safe_get_content(result.get('source_query'), 'Source Query')}")
    # print(f"    Git Query: {safe_get_content(result.get('git_query'), 'Git Query')}")
    # print(f"    GitHub Query: {safe_get_content(result.get('github_query'), 'GitHub Query')}")
    # print(f"    Docs Query: {safe_get_content(result.get('docs_query'), 'Docs Query')}")

    # print("\nResponse:")
    # print(f"    Source Response: {safe_get_content(result.get('source_response'), 'Source Response')}")
    # print(f"    Git Response: {safe_get_content(result.get('git_response'), 'Git Response')}")
    # print(f"    GitHub Response: {safe_get_content(result.get('github_response'), 'GitHub Response')}")
    # print(f"    Docs Response: {safe_get_content(result.get('docs_response'), 'Docs Response')}")

    # print("\nResults:")
    # print(f"    Chat Reply: {safe_get_content(result.get('should_run_chat'), 'Chat Should Reply')}")
    # print(f"    Diagram Reply: {safe_get_content(result.get('should_run_diagram'), 'Diagram Should Reply')}")
    # print(f"    Navigation Reply: {safe_get_content(result.get('should_run_navigation'), 'Navigation Should Reply')}")


    # print("\nResults:")
    print(f"    Chat: {safe_get_content(result.get('chat_reply'), 'Chat Reply')}")
    print(f"    Diagram: {safe_get_content(result.get('diagram_reply'), 'Diagram Reply')}")
    print(f"    Navigation: {safe_get_content(result.get('navigation_reply'), 'Navigation Reply')}")