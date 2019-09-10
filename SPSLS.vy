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

Player : 
{
    playerAddr : address,
    playerHash: bytes32
}

participants : Player[2] # Holds information about players
gameFee : uint256 # Fee that each player needs to pay
reward : uint256 # Reward that the winner will receive


@public
def __init__():
    self.gameFee = 5
    self.reward = 2 * self.gameFee
    
def handleFee():
    if(msg.value - self.gameFee >= 0):
        send(msg.sender, msg.value - self.gameFee)
        return True
    else:
        send(msg.sender, msg.value)
        return False
        
@public
@payable
def register():
    assert(handleFee(), "Insufficient Fee Paid")
    assert(registered(), "Player Already Registered")
    # Check whether the player is already registered.
    # Register the player
    pass

def play(choice : ):