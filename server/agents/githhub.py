from typing import List, Dict, Any, Optional, Type
import os
import json
from pydantic import BaseModel, Field, PrivateAttr
from langchain.tools import BaseTool
from github import Github, GithubException
from langchain_core.callbacks.manager import CallbackManagerForToolRun

# Set your GitHub token
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


class GitHubTools:
    """Collection of tools to interact with GitHub using only an API token."""
    
    def __init__(self, github_token: str = GITHUB_TOKEN):
        self.github = Github(github_token)
    
    def get_repo(self, repo_name: str):
        try:
            return self.github.get_repo(repo_name)
        except GithubException as e:
            raise ValueError(f"Error accessing repository: {str(e)}")

class SearchIssuesInput(BaseModel):
    """Input for searching issues in a GitHub repository."""
    
    repo_name: str = Field(
        description="The full name of the repository (e.g., 'langchain-ai/langchain')"
    )
    query: str = Field(
        description="The search query for issues"
    )
    state: str = Field(
        default="all", 
        description="The state of issues to return (all, open, closed)"
    )
    limit: int = Field(
        default=10,
        description="Maximum number of issues to return"
    )


class SearchIssuesAndPRsTool(BaseTool):
    """Tool for searching issues and pull requests in a GitHub repository."""
    
    name: str = "github_search_issues"
    description: str = """
    Search for issues and pull requests in a GitHub repository.
    Use this when you need to find specific issues or PRs by keywords, labels, or status.
    The repo_name should be in the format 'owner/repo' (e.g., 'langchain-ai/langchain').
    """
    args_schema: Type[BaseModel] = SearchIssuesInput

    # Define a private attribute for github_tools
    _github_tools: GitHubTools = PrivateAttr()

    def __init__(self, github_token: str = GITHUB_TOKEN):
        super().__init__()
        self._github_tools = GitHubTools(github_token)
    
    def _run(
        self, 
        repo_name: str,
        query: str,
        state: str = "all",
        limit: int = 10,
        run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        try:
            # Use the private attribute
            repo = self._github_tools.get_repo(repo_name)
            
            search_query = f"repo:{repo_name} {query}"
            if state != "all":
                search_query += f" state:{state}"
            
            issues_result = self._github_tools.github.search_issues(search_query)
            
            issues = []
            pull_requests = []
            for item in issues_result[:limit]:
                result = {
                    "number": item.number,
                    "title": item.title,
                    "state": item.state,
                    "created_at": item.created_at.strftime("%Y-%m-%d"),
                    "updated_at": item.updated_at.strftime("%Y-%m-%d"),
                    "url": item.html_url,
                    "labels": [label.name for label in item.labels]
                }
                if item.pull_request:
                    pull_requests.append(result)
                else:
                    issues.append(result)
            
            return json.dumps({
                "issues": issues,
                "pull_requests": pull_requests
            }, indent=2)
            
        except Exception as e:
            return f"Error searching issues: {str(e)}"
        
class GetIssueInput(BaseModel):
    """Input for getting a specific issue from a GitHub repository."""
    repo_name: str = Field(
        description="The full name of the repository (e.g., 'langchain-ai/langchain')"
    )
    issue_number: int = Field(
        description="The issue number"
    )

class GetIssueTool(BaseTool):
    """Tool for getting details about a specific issue."""
    
    name: str = "github_get_issue"
    description: str = """
    Get detailed information about a specific GitHub issue, including comments.
    Use this when you need comprehensive information about a particular issue.
    """
    args_schema: type = GetIssueInput
    
    # Define github_tools as a private attribute
    _github_tools: GitHubTools = PrivateAttr()

    def __init__(self, github_token: str = GITHUB_TOKEN):
        super().__init__()
        self._github_tools = GitHubTools(github_token)
    
    def _run(
        self, 
        repo_name: str,
        issue_number: int,
        run_manager=None
    ) -> str:
        try:
            repo = self._github_tools.get_repo(repo_name)
            issue = repo.get_issue(issue_number)
            comments = []
            for comment in issue.get_comments():
                comments.append({
                    "user": comment.user.login,
                    "created_at": comment.created_at.strftime("%Y-%m-%d"),
                    "body": comment.body
                })
            
            result = {
                "number": issue.number,
                "title": issue.title,
                "state": issue.state,
                "created_at": issue.created_at.strftime("%Y-%m-%d"),
                "updated_at": issue.updated_at.strftime("%Y-%m-%d"),
                "user": issue.user.login,
                "body": issue.body,
                "comments": comments,
                "labels": [label.name for label in issue.labels],
                "url": issue.html_url,
                "is_pull_request": issue.pull_request is not None
            }
            
            return json.dumps(result, indent=2)
            
        except Exception as e:
            return f"Error getting issue: {str(e)}"

class SearchCodeInput(BaseModel):
    """Input for searching code in a GitHub repository."""
    
    repo_name: str = Field(
        description="The full name of the repository (e.g., 'langchain-ai/langchain')"
    )
    query: str = Field(
        description="The search query for code"
    )
    extensions: Optional[List[str]] = Field(
        default=None,
        description="Filter by file extensions (e.g., ['py', 'md'])"
    )
    limit: int = Field(
        default=10,
        description="Maximum number of code files to return"
    )


class SearchCodeTool(BaseTool):
    """Tool for searching code in a GitHub repository."""
    
    name: str = "github_search_code"
    description: str = """
    Search for code in a GitHub repository.
    Use this when you need to find specific code snippets or files containing certain keywords.
    """
    args_schema: Type[BaseModel] = SearchCodeInput

    # Define _github_tools as a private attribute
    _github_tools: GitHubTools = PrivateAttr()

    def __init__(self, github_token: str = GITHUB_TOKEN):
        super().__init__()
        self._github_tools = GitHubTools(github_token)
    
    def _run(
        self, 
        repo_name: str,
        query: str,
        extensions: Optional[List[str]] = None,
        limit: int = 10,
        run_manager=None
    ) -> str:
        try:
            # Construct search query
            search_query = f"repo:{repo_name} {query}"
            if extensions:
                extension_filter = " ".join([f"extension:{ext}" for ext in extensions])
                search_query = f"{search_query} {extension_filter}"
            
            results = []
            code_results = self._github_tools.github.search_code(search_query)
            count = 0
            
            for result in code_results:
                if count >= limit:
                    break
                
                try:
                    content = result.decoded_content.decode('utf-8')
                    # Truncate content to avoid excessive output
                    content_preview = content[:500] + "..." if len(content) > 500 else content
                    
                    results.append({
                        "name": result.name,
                        "path": result.path,
                        "url": result.html_url,
                        "content_preview": content_preview,
                        "repository": result.repository.full_name
                    })
                    count += 1
                except (UnicodeDecodeError, AttributeError):
                    # Skip binary files or files with decoding issues
                    continue
            
            return json.dumps(results, indent=2)
            
        except Exception as e:
            return f"Error searching code: {str(e)}"
        
class ListRepoContentsInput(BaseModel):
    """Input for listing contents of a GitHub repository directory."""
    
    repo_name: str = Field(
        description="The full name of the repository (e.g., 'langchain-ai/langchain')"
    )
    path: str = Field(
        default="",
        description="Path of the directory to list (empty for root directory)"
    )

class ListRepoContentsTool(BaseTool):
    """Tool for listing contents of a GitHub repository directory."""
    
    name: str = "github_list_contents"
    description: str = """
    List files and directories in a GitHub repository.
    Use this when you need to explore the repository structure.
    """
    args_schema: Type[BaseModel] = ListRepoContentsInput

    # Define _github_tools as a private attribute so it's not considered a model field
    _github_tools: GitHubTools = PrivateAttr()

    def __init__(self, github_token: str = GITHUB_TOKEN):
        super().__init__()
        self._github_tools = GitHubTools(github_token)
    
    def _run(
        self, 
        repo_name: str,
        path: str = "",
        run_manager: Optional[object] = None
    ) -> str:
        try:
            # Get the repository using our private GitHubTools instance
            repo = self._github_tools.get_repo(repo_name)
            
            # Get the contents from the specified path
            contents = repo.get_contents(path)
            
            # If the result is a single file, make it a list for consistency
            if not isinstance(contents, list):
                contents = [contents]
            
            results = []
            for item in contents:
                results.append({
                    "name": item.name,
                    "path": item.path,
                    "type": item.type,  # "file" or "dir"
                    "size": item.size if item.type == "file" else None,
                    "url": item.html_url
                })
            
            return json.dumps(results, indent=2)
            
        except Exception as e:
            return f"Error listing repository contents: {str(e)}"

class GetFileContentInput(BaseModel):
    """Input for getting content of a file in a GitHub repository."""
    
    repo_name: str = Field(
        description="The full name of the repository (e.g., 'langchain-ai/langchain')"
    )
    file_path: str = Field(
        description="Path to the file in the repository"
    )


class GetFileContentTool(BaseTool):
    """Tool for getting content of a file in a GitHub repository."""
    
    name: str = "github_get_file"
    description: str = """
    Get the content of a specific file in a GitHub repository.
    Use this when you need to examine a particular file.
    """
    args_schema: Type[BaseModel] = GetFileContentInput

    # Define the GitHubTools instance as a private attribute
    _github_tools: GitHubTools = PrivateAttr()

    def __init__(self, github_token: str = GITHUB_TOKEN):
        super().__init__()
        self._github_tools = GitHubTools(github_token)
    
    def _run(
        self, 
        repo_name: str,
        file_path: str,
        run_manager: Optional[object] = None
    ) -> str:
        try:
            repo = self._github_tools.get_repo(repo_name)
            file_content = repo.get_contents(file_path)
            
            # Ensure it's a file, not a directory
            if file_content.type != "file":
                return f"Error: {file_path} is a directory, not a file"
            
            try:
                content = file_content.decoded_content.decode('utf-8')
                
                result = {
                    "name": file_content.name,
                    "path": file_content.path,
                    "content": content,
                    "size": file_content.size,
                    "url": file_content.html_url
                }
                
                # For large files, include only metadata and a preview
                if len(content) > 10000:
                    result["content"] = content[:10000] + "...\n[Content truncated due to size]"
                
                return json.dumps(result, indent=2)
                
            except UnicodeDecodeError:
                return f"Error: {file_path} appears to be a binary file and cannot be displayed as text"
            
        except Exception as e:
            return f"Error getting file content: {str(e)}"
        
class GetPullRequestInput(BaseModel):
    """Input for getting a specific pull request from a GitHub repository."""
    
    repo_name: str = Field(
        description="The full name of the repository (e.g., 'langchain-ai/langchain')"
    )
    pr_number: int = Field(
        description="The pull request number"
    )


class GetPullRequestTool(BaseTool):
    """Tool for getting details about a specific pull request."""
    
    name: str = "github_get_pull_request"
    description: str = """
    Get detailed information about a specific GitHub pull request, including comments and files changed.
    Use this when you need comprehensive information about a particular PR.
    """
    args_schema: Type[BaseModel] = GetPullRequestInput

    # Define _github_tools as a private attribute
    _github_tools: GitHubTools = PrivateAttr()

    def __init__(self, github_token: str = GITHUB_TOKEN):
        super().__init__()
        self._github_tools = GitHubTools(github_token)
    
    def _run(
        self, 
        repo_name: str,
        pr_number: int,
        run_manager: Optional[object] = None
    ) -> str:
        try:
            repo = self._github_tools.get_repo(repo_name)
            
            # Get pull request
            pr = repo.get_pull(pr_number)
            
            # Get issue comments
            comments = []
            for comment in pr.get_issue_comments():
                comments.append({
                    "user": comment.user.login,
                    "created_at": comment.created_at.strftime("%Y-%m-%d"),
                    "body": comment.body
                })
            
            # Get files changed in the PR
            files = []
            for file in pr.get_files():
                files.append({
                    "filename": file.filename,
                    "status": file.status,
                    "additions": file.additions,
                    "deletions": file.deletions,
                    "changes": file.changes
                })
            
            # Format and return the final result
            result = {
                "number": pr.number,
                "title": pr.title,
                "state": pr.state,
                "created_at": pr.created_at.strftime("%Y-%m-%d"),
                "updated_at": pr.updated_at.strftime("%Y-%m-%d"),
                "user": pr.user.login,
                "body": pr.body,
                "comments": comments,
                "files": files[:20],  # Limit to 20 files to avoid excessive output
                "additions": pr.additions,
                "deletions": pr.deletions,
                "changed_files": pr.changed_files,
                "mergeable": pr.mergeable,
                "labels": [label.name for label in pr.labels],
                "url": pr.html_url
            }
            
            return json.dumps(result, indent=2)
            
        except Exception as e:
            return f"Error getting pull request: {str(e)}"
        
# Example: Create a LangChain agent with these tools
def create_github_agent():
    from langchain.agents import AgentType, initialize_agent
    from langchain_ollama import ChatOllama
    
    # Initialize the tools
    tools = [
        SearchIssuesAndPRsTool(),
        GetIssueTool(),
        SearchCodeTool(),
        ListRepoContentsTool(),
        GetFileContentTool(),
        GetPullRequestTool()
    ]
    
    # Initialize the LLM
    llm = ChatOllama(model="qwen2.5")
    
    # Initialize the agent
    agent = initialize_agent(
        tools=tools, 
        llm=llm, 
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )
    
    return agent


# Example usage
if __name__ == "__main__":
    
    # Example 1: Use tools directly
    # search_tool = SearchIssuesAndPRsTool()
    # result = search_tool.run({
    #     "repo_name": "langchain-ai/langchain",
    #     "query": "GitLoader",
    #     "limit": 5
    # })
    # print("Search results:")
    # print(result)
    
    # Example 2: Create and use an agent
    # Uncomment the following lines to use the agent
    # """
    agent = create_github_agent()
    agent.run("Find issues related to GitLoader in the langchain-ai/langchain repository and get details on the most recent one")
    # """