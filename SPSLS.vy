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
num_players: uint256
participants: Player[2]
playerPayout: map(address, wei_value)
opponent: map(address,bool)
winner: string[10]
agent_choice: uint256
owner_address: address
game_counts: uint256
iter_counts: uint256
revealTime: timestamp
player1_wins: public(uint256)
player2_wins: public(uint256)
agent_wins: public(uint256)
revealer: uint256

@public
def __init__(bid: wei_value, addr: address):
    self.gameFee = bid
    self.num_players = 0
    self.owner_address = addr
    self.game_counts = 0
    self.iter_counts = 10
    self.participants[0].playerChoice = 99
    self.participants[1].playerChoice = 99
    self.revealer = 99
    
@public
@constant
def get_owner_addr() -> address:
    return self.owner_address

@public
@constant
def get_fee() -> wei_value:
    return self.gameFee

@public
@constant
def get_payable_amount(addr: address) -> wei_value:
    return self.playerPayout[addr]

@public
@constant
def get_number_players() -> uint256:
    return self.num_players

@public
@constant
def get_game_count() -> uint256:
    return self.game_counts

@public
@constant
def get_agent_choice() -> uint256:
    return self.agent_choice

@public
@constant
def get_player_hash(addr:address) -> bytes32:
    phash : bytes32
    if addr == self.participants[0].playerAddr:
        phash = self.participants[0].playerHash
    elif addr == self.participants[1].playerAddr:
        phash = self.participants[1].playerHash
    return phash



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
        if is_valid:
            self.participants[self.num_players % 2].playerAddr = msg.sender
            self.num_players += 1
            if msg.value > self.gameFee:
                self.playerPayout[msg.sender] += msg.value - self.gameFee
        
@public
def select_human_opponent(oppn: bool):
    if self.is_registered(msg.sender):
        if self.game_counts == 0:
            self.opponent[msg.sender] = oppn

@public
@constant
def check_opponent(addr: address)->bool:
    return self.opponent[addr]
    
@private 
def check_winner(pl1: uint256, pl2: uint256) -> uint256:
    self.game_counts += 1
    if (pl1+1)%5 == pl2:
        return pl2
    elif (pl1+2)%5== pl2:
        return pl2
    else:
        return pl1

@constant
@private
def valid_choice(ch: uint256) -> bool:
    return (ch >= 0 and ch <= 4)   

@constant
@public
def check_valid_choice(ch: uint256) -> bool:
    return self.valid_choice(ch)

@private
def gamePayout(winner_idx: uint256):
    if self.num_players == 2:
        if winner_idx != 99:
            send(self.participants[winner_idx].playerAddr, 2 * self.gameFee)
        else:
            send(self.owner_address, 2 * self.gameFee)
        send(self.participants[0].playerAddr, self.playerPayout[self.participants[0].playerAddr])
        send(self.participants[1].playerAddr, self.playerPayout[self.participants[1].playerAddr])
    else:
        send(self.participants[0].playerAddr, self.playerPayout[self.participants[0].playerAddr])
    
@private
def reset_game():
    self.playerPayout[self.participants[0].playerAddr] = 0
    self.playerPayout[self.participants[1].playerAddr] = 0
    self.opponent[self.participants[0].playerAddr] = False
    self.opponent[self.participants[1].playerAddr] = False
    self.participants[0].playerChoice = 99
    self.participants[1].playerChoice = 99
    clear(self.participants)
    clear(self.game_counts)
    clear(self.num_players)
    clear(self.winner)
    clear(self.player1_wins)
    clear(self.player2_wins)
    clear(self.revealTime)
    clear(self.agent_choice)
    
@public
def check_game_winner() -> string[10]:
    if self.num_players == 2:
        winner_idx: uint256 = 99
        r_winner: string[10]
        if self.game_counts == self.iter_counts:
            if self.player1_wins > self.player2_wins:
                winner_idx = 0
                r_winner = "Player 1"
            elif self.player1_wins < self.player2_wins:
                winner_idx = 1
                r_winner = "Player 2"
            else:
                r_winner = "Draw"
            self.gamePayout(winner_idx)
            self.reset_game()
        return r_winner
    else:
        winner_idx: uint256 = 99
        r_winner: string[10]
        if self.game_counts == self.iter_counts:
            if self.player1_wins > self.agent_wins:
                r_winner = "Player"
            elif self.player1_wins < self.agent_wins:
                r_winner = "Agent"
            else:
                r_winner = "Draw"
            self.gamePayout(0)
            self.reset_game()
        return r_winner
        
@public
def check_round_winner() -> string[10]:
    if self.num_players == 2:
        if self.participants[0].playerChoice != 99 and self.participants[1].playerChoice != 99 and block.timestamp <= self.revealTime + 60:
            win: uint256
            win = self.check_winner(self.participants[0].playerChoice, self.participants[1].playerChoice)
            if win == self.participants[0].playerChoice and win == self.participants[1].playerChoice:
                self.participants[0].playerChoice = 99
                self.participants[1].playerChoice = 99
                return "Draw"
            elif win == self.participants[1].playerChoice:
                self.participants[0].playerChoice = 99
                self.participants[1].playerChoice = 99
                self.player2_wins += 1
                return "Player 2"
            else:
                self.player1_wins += 1
                self.participants[0].playerChoice = 99
                self.participants[1].playerChoice = 99
                return "Player 1"
        else:
            if self.revealTime != 0 and block.timestamp > self.revealTime + 60:
                if self.revealer == 0:
                    self.player1_wins += 1
                    self.participants[0].playerChoice = 99
                    self.participants[1].playerChoice = 99
                    return "Player 1"
                elif self.revealer == 1:
                    self.participants[0].playerChoice = 99
                    self.participants[1].playerChoice = 99
                    return "Player 2"
                else:
                    self.participants[0].playerChoice = 99
                    self.participants[1].playerChoice = 99
                    return "Draw"
            return ""
    else:
        win: uint256
        win = self.check_winner(self.participants[0].playerChoice, self.agent_choice)
        if win == self.participants[0].playerChoice and win == self.agent_choice:
            self.participants[0].playerChoice = 99
            return "Draw"
        elif win == self.agent_choice:
            self.participants[0].playerChoice = 99
            self.agent_wins += 1
            return "Agent"
        else:
            self.player1_wins += 1
            self.participants[0].playerChoice = 99
            return "Player"
        
@private
def gen_random_choice() -> uint256:
    temp:uint256 = ((block.number + 3142) ** 3) % 17
    return temp % 5
    
@public
def reveal(ch: uint256, nonce: uint256):
    if self.is_registered(msg.sender):
        if self.valid_choice(ch):
            if self.opponent[msg.sender]:
                if self.num_players == 2:
                    hash_0: uint256 = convert(self.participants[0].playerHash, uint256)
                    hash_1: uint256 = convert(self.participants[1].playerHash, uint256)
                    if hash_0 != 0 and hash_1 !=0:
                        newHash: bytes32 = keccak256(convert(bitwise_xor(convert(keccak256(convert(ch, bytes32)), uint256), convert(keccak256(convert(nonce, bytes32)), uint256)), bytes32))
                        playerId: uint256
                        if(msg.sender == self.participants[0].playerAddr):
                            playerId = 0
                        else:
                            playerId = 1
                        if newHash == self.participants[playerId].playerHash:
                            if self.participants[0].playerChoice == 99 and self.participants[1].playerChoice == 99:
                                self.revealTime = block.timestamp
                                if msg.sender == self.participants[0].playerAddr:
                                    self.revealer = 0
                                elif msg.sender == self.participants[1].playerAddr:
                                    self.revealer = 1
                            self.participants[playerId].playerChoice = ch
            else:
                if self.num_players == 1:
                    hash_0: uint256 = convert(self.participants[0].playerHash, uint256)
                    if hash_0 != 0:
                        newHash: bytes32 = keccak256(convert(bitwise_xor(convert(keccak256(convert(ch, bytes32)), uint256), convert(keccak256(convert(nonce, bytes32)), uint256)), bytes32))
                        if newHash == self.participants[0].playerHash:
                            self.participants[0].playerChoice = ch
                            self.agent_choice = self.gen_random_choice()
            
@public 
def play(choiceHash: bytes32):
    if self.is_registered(msg.sender):
        if self.game_counts < self.iter_counts:
            if(self.opponent[msg.sender] == True):
                if msg.sender == self.participants[0].playerAddr:
                    self.participants[0].playerHash = choiceHash
                else:
                    self.participants[1].playerHash = choiceHash
            else:
                self.participants[0].playerHash = choiceHash