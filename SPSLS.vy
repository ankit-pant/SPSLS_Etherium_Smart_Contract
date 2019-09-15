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
num_players: public(uint256)
participants: Player[2]
playerPayout: public(map(address, wei_value))
opponent: public(map(address,bool))
winner: public(string[10])
agent_choice: uint256
owner_address: address
game_counts: public(uint256)
iter_counts: public(uint256)

@public
def __init__(bid: wei_value, addr: address):
    self.gameFee = bid
    self.num_players = 0
    self.owner_address = addr
    self.game_counts = 0
    self.iter_counts = 10

# @payable
@private
def check_validity(addr: address, fee: wei_value) -> bool:
    if(self.num_players >= 2 or fee < self.gameFee):
        send(addr, fee)
        return False
    return True

@private    
def is_registered(addr: address) -> bool:
    return (addr == self.participants[0].playerAddr or addr == self.participants[1].playerAddr)
    
@public
@payable
def register():
    is_valid: bool = self.is_registered(msg.sender)
    if is_valid:
        send(msg.sender, msg.value)
    else:
        is_valid = self.check_validity(msg.sender, msg.value)
        assert is_valid
        self.participants[self.num_players % 2].playerAddr = msg.sender
        self.num_players += 1
        if msg.value > self.gameFee:
            self.playerPayout[msg.sender] += msg.value - self.gameFee
        
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
    if self.game_counts < self.iter_counts:
        assert(ch >= 0)
        assert(ch <= 4)
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