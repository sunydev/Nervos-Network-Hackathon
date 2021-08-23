pragma solidity >=0.8.0;

contract SimpleStorage {
    address payable public  owner;
    
    constructor() public{
        owner=payable(msg.sender);
    }
    
    function getBalance() view public returns(uint256){
        return address(this).balance;
    }
    
    function payTrack(uint256 amount) payable public
    {
        require(msg.value==amount);
    }
    

}
