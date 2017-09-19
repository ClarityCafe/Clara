# Server instance for Chatbot
# the RPC layout allows the chatbot to function outside of the botspace.
# RPC Client is zeropc, see http://www.zerorpc.io/

from chatterbot import ChatBot
import zeropc


chatbot = ChatBot(
# a gya af instance
  'Clara',
  trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)

# apparently, the initial author can't Pythonk so we'll use the sample Chatbot Engrish
# TODO: make it use multiple corpuses and decide an output based on input
chatbot.train('chatterbot.corpus.english')


# TODO: make chatbot listen and return a statement later
