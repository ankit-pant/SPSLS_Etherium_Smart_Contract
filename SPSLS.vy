struct Player:
    playerAddr: address
    playerHash: bytes32
    playerChoice: uint256
    
    
gameFee: public(wei_value)
players: public(uint256)
participants: Player[2]
playerPayout: public(map(address, wei_value))
opponent: public(map(address,uint256))

@public
def __init__(bid: wei_value):
    self.gameFee = bid
    self.players = 0
    
@public
@payable
def register():
    if self.players <2:
        self.participants[self.players].playerAddr = msg.sender
        self.players += 1
        assert msg.value >= self.gameFee
        if msg.value > self.gameFee:
            self.playerPayout[msg.sender] += msg.value - self.gameFee
    else:
        send(msg.sender,msg.value)
        
@public
def select_opponent(oppn: uint256):
    self.opponent[msg.sender] = oppn
    
@public
def player_choice(ch: uint256):
    # assert ch>=1 and ch<=5
    self.participants[self.players].playerChoice = ch

    
    