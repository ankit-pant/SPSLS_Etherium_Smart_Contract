# Fixed amount each player needs to pay to the Contract
gameFee : uint256
player1 : address
player2 : address
p1_hash : bytes32
p2_hash : bytes32

######################
# Game Structure
# 0 : Rock
# 1 : Spock
# 2 : Paper
# 3 : Lizard
# 4 : Scissor
######################

@public
def __init__():
    # Initialise game fee
    self.gameFee = 5

def register():
    # Check if the amount paid by the player equals game fee.
    # Check whether the player is already registered.
    # Register the player
    pass