# Server instance for Chatbot
# the RPC layout allows the chatbot to function outside of the botspace.
# RPC Client is zeropc, see http://www.zerorpc.io/
# This uses Gunthercox's chatterbot. See https://github.com/gunthercox/ChatterBot

from chatterbot import ChatBot
import zeropc


chatbot = ChatBot(
# a gya af instance
  "Clara",
  trainer="chatterbot.trainers.ChatterBotCorpusTrainer"
)

# apparently, the initial author can"t Pythonk so we"ll use the sample Chatbot Engrish
# TODO: make it use multiple corpuses and decide an output based on input
chatbot.train("chatterbot.corpus.english")


# TODO: make chatbot listen and return a statement later

class ChatterBotRPC(object):
  def listenAndReply(self, res):
    return chatterbot.get_response(res)

def main():
  s= zeropc.Server(ChatterBotRPC())
  s.bind("http://localhost:3000")
  s.run()
  
# idk what this typechecker does but it kinda works
if __name__ == "__main__": main()
     
     