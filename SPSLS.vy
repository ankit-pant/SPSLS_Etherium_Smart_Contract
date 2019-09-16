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
    
    
gameFee: wei_value
num_players: public(uint256)
participants: Player[2]
playerPayout: public(map(address, wei_value))
opponent: public(map(address,bool))
winner: public(string[10])
agent_choice: uint256
owner_address: address
game_counts: public(uint256)
iter_counts: public(uint256)
tempHash: public(bytes32) # delete it post testing

@public
def __init__(bid: wei_value, addr: address):
    self.gameFee = bid
    self.num_players = 0
    self.owner_address = addr
    self.game_counts = 0
    self.iter_counts = 5

@public
@constant
def get_owner_addr() -> address:
    return self.owner_address

@public
@constant
def get_fee() -> wei_value:
    return self.gameFee

@private
def check_validity(addr: address, fee: wei_value) -> bool:
    if(self.num_players >= 2 or fee < self.gameFee):
        send(addr, fee)
        return False
    return True

@constant
@private    
def is_registered(addr: address) -> bool:
    return (addr == self.participants[0].playerAddr or addr == self.participants[1].playerAddr)
    
@public
def check_registrations(addr: address) -> bool:
    reg : bool = self.is_registered(addr)
    if reg==True:
        return True
    else:
        return False

@public
@payable
def register():
    if self.is_registered(msg.sender):
        send(msg.sender, msg.value)
    else:
        is_valid: bool = self.check_validity(msg.sender, msg.value)
        assert is_valid, "Insufficient Fee Paid or Game is already Full"
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

@constant
@private
def valid_choice(ch: uint256) -> bool:
    return (ch >= 0 and ch <= 4)    
    
@public
def reveal(ch: uint256, nonce: uint256):
    assert self.is_registered(msg.sender), "You are not Registered for this game"
    assert self.valid_choice(ch), "Enter choice between 0 and 4"
    if self.opponent[msg.sender]:
        assert self.num_players == 2, "Opponent not registered yet"
        hash_0: uint256 = convert(self.participants[0].playerHash, uint256)
        hash_1: uint256 = convert(self.participants[1].playerHash, uint256)
        assert hash_0 != 0, "Opponent's commitment not made yet"
        assert hash_1 != 0, "Opponent's commitment not made yet"
        newHash: bytes32 = keccak256(convert(bitwise_xor(convert(keccak256(convert(ch, bytes32)), uint256), convert(keccak256(convert(nonce, bytes32)), uint256)), bytes32))
        playerId: uint256
        if(msg.sender == self.participants[0].playerAddr):
            playerId = 0
        else:
            playerId = 1
        assert newHash == self.participants[playerId].playerHash, "Hash Mismatch"
        
    else:
        pass
    
@public 
def play(choiceHash: bytes32):
    if self.game_counts < self.iter_counts:
        if msg.sender == self.participants[0].playerAddr:
            self.participants[0].playerHash = choiceHash
        else:
            self.participants[1].playerHash = choiceHash
        # if(self.opponent[msg.sender]== True):
        #     pass
        #     # play_with_human()
        # else:
        #     self.play_with_agent()
        #     if self.playerPayout[self.participants[0].playerAddr] == 0:
        #         self.playerPayout[self.participants[0].playerAddr] += self.gameFee
        self.game_counts += 1
    if (self.game_counts == self.iter_counts - 1):
        if(self.opponent[msg.sender]== True):
            pass
            # play_with_human()
        else:
            send(self.owner_address, self.playerPayout[self.participants[0].playerAddr])
            self.playerPayout[self.participants[0].playerAddr] = 0
        self.game_counts = 0