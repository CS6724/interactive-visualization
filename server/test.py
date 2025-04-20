from agents.graph import main

if __name__ == "__main__":
    # Full =  Who modified the selected class last? What was the commit message
    # Git =  "Who modified the project last ?"
    # Source = "Which class has the top most methods?"
    result = main("What is the most recent issue that needs fixing")
#     result = main()
    print(f"""Information:
            User Query: {result['user_query'][-1].content}
            Source Query: {result['source_query'][-1].content}
            Git Query: {result['git_query'][-1].content}
            GitHub Query: {result['github_query'][-1].content}
            Docs Query: {result['docs_query'][-1].content}""")
    print(f"""Response:
            Source Response: {result['source_response'][-1].content}"
            Git Response: {result['git_response'][-1].content}
           """)
        
        #    
        #     GitHub Response: {result['github_response'][-1].content}
        #     Docs Response: {result['docs_response'][-1].content}
    
    print(f"""Results:
            Chat: {result['chat_reply'].content}
            """)
        # diagram: {result['diagram_reply'].content}
        #     Navigation: {result['navigation_reply'].content}