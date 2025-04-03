from flask import Flask, request
from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
import asyncio

app = Flask(__name__)

# Configure the model to use Ollama's local endpoint
model = OpenAIChatCompletionsModel(
    model="qwen2.5:3b",  # The model you pulled with Ollama
    openai_client=AsyncOpenAI(
        base_url="http://localhost:11434/v1",  # Ollama's OpenAI-compatible endpoint
        api_key="ollama"  # Dummy API key (Ollama doesn't require a real one)
    )
)

# Create a simple agent
agent = Agent(
    name="Assistant",
    instructions="You are a helpful assistant.",
    model=model
)

# Asynchronous function to handle requests
async def get_response(user_message):
    result = await Runner.run(agent, user_message)  # ✅ Runs asynchronously
    return result.final_output

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    # Use an event loop correctly in Flask
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(get_response(user_message))
    print(response)
    return response  # ✅ Returns plain text response

if __name__ == "__main__":
    app.run(port=5000)
