from agents.graph import main
from langchain_core.messages import BaseMessage

def safe_get_content(value, label):
    if isinstance(value, list) and value:
        return value[-1].content
    if isinstance(value, BaseMessage):
        return value.content
    return f"{label}: PASS or not applicable"

if __name__ == "__main__":
    # Full =  Who modified the selected class last? What was the commit message
    # Git =  "Who modified the project last ?"
    # Source = "Which class has the top most methods?"
    # GitHub = "What is the most recent issue that needs fixing"
    result = main("WHich class is the largest in terms of number of methods and properties and when was it last modified?")

    print("Information:")
    print(f"    User Query: {safe_get_content(result.get('user_query'), 'User Query')}")
    print(f"    Source Query: {safe_get_content(result.get('source_query'), 'Source Query')}")
    print(f"    Git Query: {safe_get_content(result.get('git_query'), 'Git Query')}")
    print(f"    GitHub Query: {safe_get_content(result.get('github_query'), 'GitHub Query')}")
    print(f"    Docs Query: {safe_get_content(result.get('docs_query'), 'Docs Query')}")

    print("\nResponse:")
    print(f"    Source Response: {safe_get_content(result.get('source_response'), 'Source Response')}")
    print(f"    Git Response: {safe_get_content(result.get('git_response'), 'Git Response')}")
    print(f"    GitHub Response: {safe_get_content(result.get('github_response'), 'GitHub Response')}")
    print(f"    Docs Response: {safe_get_content(result.get('docs_response'), 'Docs Response')}")

    print("\nResults:")
    print(f"    Chat: {safe_get_content(result.get('chat_reply'), 'Chat Reply')}")
    print(f"    Diagram: {safe_get_content(result.get('diagram_reply'), 'Diagram Reply')}")
    print(f"    Navigation: {safe_get_content(result.get('navigation_reply'), 'Navigation Reply')}")