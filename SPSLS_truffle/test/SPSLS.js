const SPSLS = artifacts.require("SPSLS");

contract("SPSLS", (accounts) => {
    it("... should set the owners address and bid amount", async() =>{
        const spsobj = await SPSLS.deployed();
        const stored_fee = await spsobj.get_fee();
		const stored_addr = await spsobj.get_owner_addr();
		assert.equal(stored_fee,2000000000000000000,"Fee amount was not stored")
		assert.equal(stored_addr,0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c,"Owner address was not stored")
    });

    it("... should register new user if fee paid >= game fee", async() => {
        const spsobj = await SPSLS.deployed();
        const game_fee = await spsobj.get_fee();
        const p1_fee = 100;
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        player3_addr = accounts[3];
        // spsobj.sendTransaction(p1_fee, {from: player1_addr});
        // assert.equal(50,payout.toNumber(),"Payout is not same");
        // spsobj.address = player1_addr;
        // spsobj.value = p1_fee;
        const reg = await spsobj.register.call({from: player3_addr, to: spsobj.address, value:3000000000000000000});
        assert.equal(true,reg,"Unsuccessful Registration")
        // const pay = await spsobj.get_payable_amount(player3_addr,{from:player3_addr,to:spsobj.address})
        // assert.equal(1000000000000000000,pay,"Payouts don't match")
        // reg = await spsobj.check_registrations(player3_addr,{from: player3_addr, to: spsobj.address});
        // assert.equal(true,reg, "Player 1 has not registered");

        // tx = instance.sendTransaction({from: accounts[4], to: instance.address, value: 200000000000000000})
    });

    it("... should not register if fee paid < game fee", async() => {
        const spsobj = await SPSLS.deployed();
        player2_addr = accounts[2];
        const noreg = await spsobj.register.call({from: player2_addr, to: spsobj.address, value:300000});
        assert.equal(false,noreg,"Invalid User Registered")
    });
    
    it("... should not register if number of players >=2", async() => {
        const spsobj = await SPSLS.deployed();
        player1_addr = accounts[1];
        player2_addr = accounts[2];
        player3_addr = accounts[3];
        const reg1 = await spsobj.register.call({from: player1_addr, to: spsobj.address, value:2000000000000000000});
        const reg2 = await spsobj.register.call({from: player2_addr, to: spsobj.address, value:2000000000000000000});
        const reg3 = await spsobj.register.call({from: player3_addr, to: spsobj.address, value:2000000000000000000});
        // assert.equal(false,reg3,"Invalid User Registered")
        const num = await spsobj.num_players.call({from: player1_addr, to: spsobj.address});
        assert.equal(3,num,"Invalid User Registered")
    });
});