import re
from langchain_core.messages import BaseMessage

def clean_string(value):
    return re.sub(r"<think>.*?</think>", "", value, flags=re.DOTALL)