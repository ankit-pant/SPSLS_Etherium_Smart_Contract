const SPSLS = artifacts.require("SPSLS");

contract("SPSLS",() => {
    it("... should set the owners address and bid amount", async() =>{
        const spsobj = await SPSLS.deployed();
        const stored_fee = await spsobj.get_fee();
		const stored_addr = await spsobj.get_owner_addr();
		assert.equal(stored_fee,50,"Fee amount was not stored")
		assert.equal(stored_addr,0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c,"Owner address was not stored")
    });
});