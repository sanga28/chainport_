// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/* ========= INTERFACE ========= */
interface IContainerRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
}

/* ========= CONTRACT ========= */
contract DeploymentManager {

    struct DeploymentRequest {
        address owner;
        uint256 tokenId;
        uint256 fee;
        bool executed;
        bool exists;
    }

    uint256 public nextRequestId;
    mapping(uint256 => DeploymentRequest) public requests;

    address public registry;
    address public admin;

    /* ========= EVENTS ========= */
    event DeploymentRequested(
        uint256 indexed requestId,
        address indexed owner,
        uint256 indexed tokenId,
        uint256 fee
    );

    event DeploymentExecuted(
        uint256 indexed requestId,
        address indexed executor,
        uint256 fee
    );

    /* ========= MODIFIERS ========= */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    /* ========= CONSTRUCTOR ========= */
    constructor(address _registry) {
        registry = _registry;
        admin = msg.sender;
    }

    /* ========= USER STEP ========= */
    function requestDeployment(uint256 tokenId) external payable {
        require(msg.value > 0, "Deployment fee required");

        address owner = IContainerRegistry(registry).ownerOf(tokenId);
        require(owner == msg.sender, "Not token owner");

        requests[nextRequestId] = DeploymentRequest({
            owner: msg.sender,
            tokenId: tokenId,
            fee: msg.value,
            executed: false,
            exists: true
        });

        emit DeploymentRequested(
            nextRequestId,
            msg.sender,
            tokenId,
            msg.value
        );

        nextRequestId++;
    }

    /* ========= ADMIN STEP (CORE VALUE) ========= */
    function executeDeployment(uint256 requestId)
        external
        onlyAdmin
    {
        DeploymentRequest storage req = requests[requestId];

        require(req.exists, "Invalid request");
        require(!req.executed, "Already executed");

        req.executed = true;

        /* 🔥 REAL WALLET → WALLET TRANSFER */
        (bool success, ) = admin.call{value: req.fee}("");
        require(success, "ETH transfer failed");

        emit DeploymentExecuted(
            requestId,
            admin,
            req.fee
        );
    }

    /* ========= VIEW HELPERS ========= */
    function getRequest(uint256 requestId)
        external
        view
        returns (
            address owner,
            uint256 tokenId,
            uint256 fee,
            bool executed
        )
    {
        DeploymentRequest memory r = requests[requestId];
        require(r.exists, "Request not found");

        return (
            r.owner,
            r.tokenId,
            r.fee,
            r.executed
        );
    }
}
