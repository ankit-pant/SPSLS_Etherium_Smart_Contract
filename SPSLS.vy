# Authors : 
# Hitesh Kaushik : 2018201057
# Ankit Pant : 2018201035

######################
# Game Structure
# 0 : Rock
# 1 : Spock
# 2 : Paper
# 3 : Lizard
# 4 : Scissor 
######################


struct Player:
    playerAddr: address
    playerHash: bytes32
    playerChoice: uint256
    playerNo: uint256
    
    
gameFee: public(wei_value)
players: public(uint256)
participants: Player[2]
playerPayout: public(map(address, wei_value))
opponent: public(map(address,bool))
winner: public(string[10])
agent_choice: uint256
owner_address: address
game_counts: public(uint256)

@public
def __init__(bid: wei_value, addr: address):
    self.gameFee = bid
    self.players = 0
    self.owner_address = addr
    self.game_counts = 0
    
@public
@payable
def register():
    if self.players <2:
        if self.players == 0 :
            self.participants[0].playerAddr = msg.sender
        else:
            self.participants[1].playerAddr = msg.sender
        self.players += 1
        assert msg.value >= self.gameFee
        if msg.value > self.gameFee:
            self.playerPayout[msg.sender] += msg.value - self.gameFee
    else:
        send(msg.sender,msg.value)
        
@public
def human_opponent(oppn: bool):
    assert self.game_counts == 0
    self.opponent[msg.sender] = oppn
    
@private 
def check_winner(pl1: uint256, pl2: uint256) -> uint256:
    if (pl1+1)%5 == pl2:
        return pl2
    elif (pl1+2)%5== pl2:
        return pl2
    else:
        return pl1
    
@private
def play_with_agent():
    self.agent_choice = 4
    win: uint256
    win = self.check_winner(self.participants[0].playerChoice,self.agent_choice)
    if win == self.participants[0].playerChoice and win == self.agent_choice:
        self.winner = "Draw"
    elif win== self.agent_choice:
        self.winner = "Agent"
    else:
        self.winner = "Player 1"
    

@public 
def play(ch: uint256):
    if self.game_counts < 4:
        # assert (ch>=1 and ch <=5)
        self.participants[0].playerChoice = ch
        if(self.opponent[msg.sender]== True):
            pass
            # play_with_human()
        else:
            self.play_with_agent()
            if self.playerPayout[self.participants[0].playerAddr] == 0:
                self.playerPayout[self.participants[0].playerAddr] += self.gameFee
        self.game_counts += 1
    if self.game_counts == 4:
        if(self.opponent[msg.sender]== True):
            pass
            # play_with_human()
        else:
            send(self.owner_address, self.playerPayout[self.participants[0].playerAddr])
            self.playerPayout[self.participants[0].playerAddr] = 0
        self.game_counts = 0
        

        

    
    