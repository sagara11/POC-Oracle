//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

error Unauthorized();

contract Oracle {
    struct Assets {
        string name;
        uint256 amount;
        uint256 decimal;
    }

    mapping(string => Assets) public assets;
    address s_owner;

    event AddAssets(
        string _from,
        string _to,
        uint256 _amount,
        uint256 _decimal
    );
    event RequestPrice(address _from, address _to);

    uint256 private assetsSize;

    modifier onlyOwner() {
        if (msg.sender != s_owner) revert Unauthorized();
        _;
    }

    constructor() {
        s_owner = msg.sender;
    }

    function testConnection() public pure returns (bool) {
        return true;
    }

    function addAssets(
        string memory _from,
        string memory _to,
        uint256 _amount,
        uint256 _decimal
    ) public onlyOwner {
        assets[_from].name = _to;
        assets[_from].amount = _amount;
        assets[_from].decimal = _decimal;
        assetsSize += 1;

        emit AddAssets(_from, _to, _amount, _decimal);
    }

    function getAsset(string memory _from, string memory _to)
        public
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < assetsSize; i++) {
            if (
                keccak256(abi.encodePacked(assets[_from].name)) ==
                keccak256(abi.encodePacked(_to))
            ) {
                return assets[_from].amount;
            }
        }
    }

    function requestPrice(address _from, address _to) public {
        emit RequestPrice(_from, _to);
    }
}

// xử lý bất đồng bộ (xử lý ở các block tiếp theo)