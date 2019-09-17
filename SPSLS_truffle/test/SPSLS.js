const SPSLS = artifacts.require("SPSLS");

contract("SPSLS", (accounts) => {
    it("... should set the owners address and bid amount", async() =>{
        const spsobj = await SPSLS.deployed();
        const stored_fee = await spsobj.get_fee();
		const stored_addr = await spsobj.get_owner_addr();
		assert.equal(stored_fee,2000000000000000000,"Fee amount was not stored")
		assert.equal(stored_addr,0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c,"Owner address was not stored")
    });    
});

contract("SPSLS", (accounts) => {

    it("... should not register if fee paid < game fee", async() => {
        const spsobj = await SPSLS.deployed();
        player2_addr = accounts[2];
        const noreg = await spsobj.register({from: player2_addr, to: spsobj.address, value:300000});
        regis = await spsobj.check_registrations.call(player2_addr,{from: player2_addr, to: spsobj.address});
        assert.equal(false,regis,"Invalid User Registered");
    }); 

    it("... should register new user if fee paid >= game fee", async() => {
        const spsobj = await SPSLS.deployed();
        const game_fee = await spsobj.get_fee();
        const p1_fee = 100;
        player1_addr = accounts[1];
        const reg1 = await spsobj.register({from: player1_addr, to: spsobj.address, value:3000000000000000000});
        is_reg1 =  await spsobj.check_registrations.call(player1_addr,{from:player1_addr, to:spsobj.address});
        assert.equal(true,is_reg1,"Unable to register valid user")
        
        player2_addr = accounts[2];
        const reg2 = await spsobj.register({from: player2_addr, to: spsobj.address, value:2000000000000000000});
        is_reg2 =  await spsobj.check_registrations.call(player2_addr,{from:player2_addr, to:spsobj.address});
        assert.equal(true,is_reg2,"Unable to register valid user")
    });

    it("... should update contract balance after player registration", async() => {
        const spsobj = await SPSLS.deployed();
        cb = await web3.eth.getBalance(spsobj.address);
        assert(4000000000000000000,cb,"Contract balance not set");
    });
    
    it("... should add excess fee paid to user's payable amount", async() =>{
        const spsobj = await SPSLS.deployed();
        const pay = await spsobj.get_payable_amount.call(player1_addr,{from:player1_addr,to:spsobj.address});
        assert.equal(1000000000000000000,pay,"Payouts don't match")
    });


    it("... should not register if number of players >=2", async() => {
        const spsobj = await SPSLS.deployed();
        player3_addr = accounts[3];
        const reg3 = await spsobj.register({from: player3_addr, to: spsobj.address, value:2000000000000000000});
        const num = await spsobj.get_number_players.call({from: player1_addr, to: spsobj.address});
        assert.equal(2,num,"Invalid User Registered");
        
    });
});



contract("SPSLS", (accounts) => {
    it("... should select opponent based on user choice (human/agent)", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        const reg1 = await spsobj.register({from: player1_addr, to: spsobj.address, value:2000000000000000000});
        // Set opponent to human
        const set_opn = await spsobj.select_human_opponent(true,{from: player1_addr, to: spsobj.address});
        // Check if opponent of player 1 is human
        const oppn = await spsobj.check_opponent.call(player1_addr,{from: player1_addr, to: spsobj.address});
        assert.equal(true,oppn,"Opponent not selected correctly");
    });

    it("... should not be able to select opponent if not registered", async()=>{
        const spsobj = await SPSLS.deployed();
        player2_addr = accounts[2];
        const set_opn = await spsobj.select_human_opponent(true,{from: player2_addr, to: spsobj.address});
        const oppn = await spsobj.check_opponent.call(player2_addr,{from: player2_addr, to: spsobj.address});
        assert.equal(false,oppn,"Opponent selected before registration");
    });
});

contract("SPSLS", (accounts) => {
    it("... should not be able to play a game if not registered", async() =>{
        const spsobj = await SPSLS.deployed();
        player4_addr = accounts[4];
        gm = await spsobj.play("0x1bcdd9a065bd1a6b1ceaba6cf4188a26543f82c696714278d4c05efdb2de27fa",{from:player4_addr, to:spsobj.address});
        count = await spsobj.get_game_count.call({from:player1_addr, to:spsobj.address});
        assert.equal(0,count,"Player able to play without registration");
    });
});

contract("SPSLS", (accounts) => {
    it("... should not be able to reveal if not registered", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        rev = await spsobj.reveal(0,3142,{from:player1_addr, to:spsobj.address});
        const phash = await spsobj.get_player_hash.call(player1_addr,{from:player1_addr, to:spsobj.address});
        assert.equal(0,phash,"Unregistered user revealed");
    });

    it("... should not be able to reveal if no choice was input earlier", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        rev = await spsobj.reveal(0,3142,{from:player1_addr, to:spsobj.address});
        const phash = await spsobj.get_player_hash.call(player1_addr,{from:player1_addr, to:spsobj.address});
        assert.equal(0,phash,"User revealed without giving choice as input");
    });


    it("... should not be able to input incorrect choice", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        const reg1 = await spsobj.register({from: player1_addr, to: spsobj.address, value:2000000000000000000});
        ch = 7
        nonce = 3142
        gm = await spsobj.play("0xb05c9f680e4bbdf227340eae9ba0bc70fb5d49b10423cd5294835e0018ef51ec",{from:player4_addr, to:spsobj.address});
        valid_ch = await spsobj.check_valid_choice.call(ch, {from: player1_addr, to: spsobj.address});
        assert.equal(false, valid_ch, "Invalid choice accepted");
    });
});

contract("SPSLS", (accounts) => {
    it("... Paper should win against Rock", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        const reg1 = await spsobj.register({from: player1_addr, to: spsobj.address, value:2000000000000000000});
        const reg2 = await spsobj.register({from: player2_addr, to: spsobj.address, value:2000000000000000000});
        p1o = spsobj.select_human_opponent(true,{from: player1_addr, to: spsobj.address});
        p2o = spsobj.select_human_opponent(true,{from: player2_addr, to: spsobj.address});
        paper = 2
        rock = 0
        nonce = 3142
        p1game = await spsobj.play("0x323bacf2f97758d9d2ffa2c5b193868f19281c30438bdb71ce646238924cf8ab",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x1bcdd9a065bd1a6b1ceaba6cf4188a26543f82c696714278d4c05efdb2de27fa",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(paper,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(rock,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Rock beats Paper");
    });

    it("... Paper should win against Spock", async() => {
        const spsobj = await SPSLS.deployed();
        paper = 2
        spock = 1
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x8e80e0be8c5867bce77a620425ece82fee461b8d9bb5d70be6c7f99429154a30",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x323bacf2f97758d9d2ffa2c5b193868f19281c30438bdb71ce646238924cf8ab",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(spock,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(paper,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 2", round_win, "Game Failed...Spock beats Paper");
    });

    it("... Rock should win against Scissors", async() => {
        const spsobj = await SPSLS.deployed();
        rock = 0
        scissors = 4
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x1bcdd9a065bd1a6b1ceaba6cf4188a26543f82c696714278d4c05efdb2de27fa",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x8f07b4f8073e63a2e7718f078d7e2b5907b1c581a42845e47c868028162a8232",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(rock,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(scissors,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Scissors beats Rock");
    });

    it("... Rock should win against Lizard", async() => {
        const spsobj = await SPSLS.deployed();
        rock = 0
        lizard = 3
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x1bcdd9a065bd1a6b1ceaba6cf4188a26543f82c696714278d4c05efdb2de27fa",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x615e5bc29c2c6bdd4321641bc1beaebc76067e765411d90f2b7172d423bed829",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(rock,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(lizard,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Lizard beats Rock");
    });

    it("... Scissors should win against Paper", async() => {
        const spsobj = await SPSLS.deployed();
        scissors = 4
        paper = 2
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x323bacf2f97758d9d2ffa2c5b193868f19281c30438bdb71ce646238924cf8ab",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x8f07b4f8073e63a2e7718f078d7e2b5907b1c581a42845e47c868028162a8232",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(paper,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(scissors,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 2", round_win, "Game Failed...Paper beats Scissors");
    });

    it("... Scissors should win against Lizard", async() => {
        const spsobj = await SPSLS.deployed();
        scissors = 4
        lizard = 3
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x615e5bc29c2c6bdd4321641bc1beaebc76067e765411d90f2b7172d423bed829",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x8f07b4f8073e63a2e7718f078d7e2b5907b1c581a42845e47c868028162a8232",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(lizard,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(scissors,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 2", round_win, "Game Failed...Lizard beats Scissors");
    });

    it("... Spock should win against Rock", async() => {
        const spsobj = await SPSLS.deployed();
        spock = 1
        rock = 0
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x8e80e0be8c5867bce77a620425ece82fee461b8d9bb5d70be6c7f99429154a30",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x1bcdd9a065bd1a6b1ceaba6cf4188a26543f82c696714278d4c05efdb2de27fa",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(spock,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(rock,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Rock beats Spock");
    });

    it("... Spock should win against Scissors", async() => {
        const spsobj = await SPSLS.deployed();
        spock = 1
        scissors = 4
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x8e80e0be8c5867bce77a620425ece82fee461b8d9bb5d70be6c7f99429154a30",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x8f07b4f8073e63a2e7718f078d7e2b5907b1c581a42845e47c868028162a8232",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(spock,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(scissors,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Scissors beats Spock");
    });
    
    it("... Lizard should win against Paper", async() => {
        const spsobj = await SPSLS.deployed();
        lizard = 3
        paper = 2
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x615e5bc29c2c6bdd4321641bc1beaebc76067e765411d90f2b7172d423bed829",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x323bacf2f97758d9d2ffa2c5b193868f19281c30438bdb71ce646238924cf8ab",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(lizard,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(paper,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Paper beats Lizard");
    });

    it("... Lizard should win against Spock", async() => {
        const spsobj = await SPSLS.deployed();
        lizard = 3
        spock = 1
        nonce = 3142
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        p1game = await spsobj.play("0x615e5bc29c2c6bdd4321641bc1beaebc76067e765411d90f2b7172d423bed829",{from:player1_addr, to:spsobj.address});
        p2game = await spsobj.play("0x8e80e0be8c5867bce77a620425ece82fee461b8d9bb5d70be6c7f99429154a30",{from:player2_addr, to:spsobj.address});
        p1rev =  await spsobj.reveal(lizard,nonce,{from:player1_addr, to:spsobj.address});
        p2rev = await spsobj.reveal(spock,nonce,{from:player2_addr, to:spsobj.address});
        round_win = await spsobj.check_round_winner.call({from:player1_addr, to:spsobj.address});
        assert.equal("Player 1", round_win, "Game Failed...Spock beats Lizard");
    });


    it("... should set game count to 0 after 10 games", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        game_cnt = await spsobj.get_game_count.call({from:player1_addr, to:spsobj.address});
        assert.equal("0", game_cnt, "Game count not reset");
    });

    // it("... should declare winner after 10 games", async() =>{
    //     const spsobj = await SPSLS.deployed();
    //     player1_addr = accounts[1];
    //     winr = await spsobj.check_game_winner.call({from:player1_addr, to:spsobj.address});
    //     assert.equal("Player 1",winr,"Wrong participant declared as winner");
    // });
});




