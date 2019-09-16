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
    it("... should register new user if fee paid >= game fee", async() => {
        const spsobj = await SPSLS.deployed();
        const game_fee = await spsobj.get_fee();
        const p1_fee = 100;
        player1_addr = accounts[1];
        const reg = await spsobj.register({from: player1_addr, to: spsobj.address, value:3000000000000000000});
        is_reg =  await spsobj.check_registrations.call(player1_addr,{from:player1_addr, to:spsobj.address});
        assert.equal(true,is_reg,"Unable to register valid user")
    });
    
    it("... should add excess fee paid to user's payable amount", async() =>{
        const spsobj = await SPSLS.deployed();
        const pay = await spsobj.get_payable_amount.call(player1_addr,{from:player1_addr,to:spsobj.address});
        assert.equal(1000000000000000000,pay,"Payouts don't match")
    });

    it("... should not register if fee paid < game fee", async() => {
        const spsobj = await SPSLS.deployed();
        player2_addr = accounts[2];
        const noreg = await spsobj.register({from: player2_addr, to: spsobj.address, value:300000});
        regis = await spsobj.check_registrations.call(player2_addr,{from: player2_addr, to: spsobj.address});
        assert.equal(false,regis,"Invalid User Registered");
    }); 

    it("... should not register if number of players >=2", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        player3_addr = accounts[3];
        const reg1 = await spsobj.register({from: player1_addr, to: spsobj.address, value:2000000000000000000});
        const reg2 = await spsobj.register({from: player2_addr, to: spsobj.address, value:2000000000000000000});
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
        count = await spsobj.get_game_count.call();
        assert.equal(0,count,"Player able to play without registration");
    });

    // it("... should not be able to input an invalid choice", async() =>{
    //     const spsobj = await SPSLS.deployed();
    //     test_choice = 7
    //     const ch = spsobj.valid_choice.call(test_choice,{from: player1_addr, to: spsobj.address});
    //     assert.equal(false,ch,"Opponent able to input invalid choice");
    // });
});