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
        const reg = await spsobj.register({from: player3_addr, to: spsobj.address, value:3000000000000000000});
        // assert.equal(true,reg,"Unsuccessful Registration")
        is_reg =  await spsobj.check_registrations.call(player3_addr,{from:player3_addr, to:spsobj.address});
        assert.equal(true,is_reg)
        const pay = await spsobj.get_payable_amount.call(player3_addr,{from:player3_addr,to:spsobj.address});
        assert.equal(1000000000000000000,pay,"Payouts don't match")
        regis = await spsobj.check_registrations.call(player3_addr,{from: player3_addr, to: spsobj.address});
        assert.equal(true,regis, "Player 3 has not registered");

        // tx = instance.sendTransaction({from: accounts[4], to: instance.address, value: 200000000000000000})
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
        assert.equal(2,num,"Invalid User Registered1");
        
    });

    
});