struct Player:
    playerAddr: address
    playerHash: bytes32
    playerChoice: uint256
    playerPayout: uint256
    
    
gameFee: public(uint256)
players: public(uint256)
participants: Player[2]

@public
def __init__(b: uint256):
    self.gameFee = b
    self.players = 0
    
@public
@payable
def register():
    if self.players <2:
        self.participants[self.players].playerAddr = msg.sender
        self.players += 1
    assert msg.value >= self.gameFee
    if msg.value > self.gameFee:
        send(msg.sender, msg.value-self.gameFee)