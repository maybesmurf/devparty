// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Devparty is Ownable, ERC1155Supply, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;
    address payable devparty = payable(0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3);

    event TipUser(address indexed from, address indexed to, uint value);
    event Subscribe(address indexed from, uint value);

    constructor() ERC1155("") {}

    function contractURI() public pure returns (string memory) {
        return
            "https://bafybeiglzzl2g3y362yyzbnutl3dku2q43oybafbnqaycmbvikqql67usm.ipfs.infura-ipfs.io";
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        returns (string memory)
    {
        require(exists(tokenId), "URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];

        return _tokenURI;
    }

    /**
     * Mint + Issue Token
     *
     * @param recipient - Token will be issued to recipient
     * @param amount - amount of tokens to mint
     * @param uri - IPFS URL
     */
    function issueToken(
        address recipient,
        uint256 amount,
        string memory uri
    ) public nonReentrant returns (uint256) {
        require(amount != 0, "Quantity should be positive");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId, amount, "");
        _setTokenURI(newItemId, uri);

        return newItemId;
    }

    /**
     * Tip a user
     *
     * @param recipient - Recipient address to be tipped
     */
    function tipUser(address payable recipient) external payable nonReentrant {
        require(msg.value > 0, 'Tip should be greater than 0');
        recipient.transfer(msg.value);

        emit TipUser(msg.sender, recipient, msg.value);
    }

    /**
     * Subscribe to Devparty Pro
     *
     */
    function subscribeToPro() external payable nonReentrant {
        require(msg.value > 0, 'Amount should be greater than 0');
        devparty.transfer(msg.value);

        emit Subscribe(msg.sender, msg.value);
    }
}
