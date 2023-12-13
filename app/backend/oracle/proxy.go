package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	abiPath             = "/home/niklas/Documents/aquilier/app/backend/contract/BookingManagement.abi.json"
	infuraURL           = "https://sepolia.infura.io/v3/8568dcbfcab044ffa3d0ab39952981b5"
	infuraWsUrl         = "wss://sepolia.infura.io/ws/v3/8568dcbfcab044ffa3d0ab39952981b5"
	SepoliaContract     = "0x4BBD5B6e419C1bAF43ba2e8319eb7aa8Fd252245"
	ganacheContract     = "0xd8c9f98e5B1A8D3031EFbcf892B86cA1a0a614b4"
	ganacheURL          = "ws://0.0.0.0:7545"
	homeAssistantAPIURL = "http://localhost:8123/api/services/input_boolean/toggle"
	token               = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1M2ZmNjFkYzA1MWE0ZGM0YTM4NzIwMWY0MWY0MTRmYiIsImlhdCI6MTY5ODA2MTU1MCwiZXhwIjoyMDEzNDIxNTUwfQ.GyNUECFqs6cae0B1FyxUjE6K5qjNK-veuphsOpRUA9g"
)

type AccessGrantedEvent struct {
	BookingID   *big.Int
	UserAddress common.Address
}

func parseEventLog(vLog types.Log, contractAbi abi.ABI) {
	// Check if the log's topics[0] (event signature) matches an event in the ABI
	event, err := contractAbi.EventByID(vLog.Topics[0])
	if err != nil {
		log.Printf("Error finding event for topic %s: %v", vLog.Topics[0].Hex(), err)
		return
	}

	fmt.Printf("Event Name: %s\n", event.Name)
	// Assuming both BookingId and UserAddress are indexed and there are no non-indexed arguments
	if event.Name == "AccessGranted" && len(vLog.Topics) == 4 {
		var accessGranted struct {
			BookingId   *big.Int
			UserAddress common.Address
			PropertyId  *big.Int
		}

		accessGranted.BookingId = new(big.Int).SetBytes(vLog.Topics[1][:])
		accessGranted.UserAddress = common.BytesToAddress(vLog.Topics[2][12:]) // Addresses are 20 bytes, padded in 32-byte topics
		accessGranted.PropertyId = new(big.Int).SetBytes(vLog.Topics[3][:])

		unlockVirtualLock()
		fmt.Printf("AccessGranted Event: %+v\n", accessGranted)
	} else {
		log.Printf("Unexpected event data for %s", event.Name)
	}
}

func unlockVirtualLock() {
	data := map[string]string{
		"entity_id": "input_boolean.virtual_lock",
	}
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Printf("Failed to marshal data: %v", err)
		return
	}

	req, err := http.NewRequest("POST", homeAssistantAPIURL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to make request: %v", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("Virtual lock unlocked: %s\n", body)
}

func testPrintLastBlock(client *ethclient.Client) {
	blockNumber, err := client.BlockNumber(context.Background())
	if err != nil {
		log.Fatalf("Failed to retrieve the latest block number: %v", err)
	}
	fmt.Printf("Latest block number: %d\n", blockNumber)
}

func main() {
	// Load ABI
	contractABI, err := loadContractABI()
	if err != nil {
		log.Fatalf("Failed to load contract ABI: %v", err)
	}
	go EventSubscriber(contractABI, ganacheURL, ganacheContract)
	go EventSubscriber(contractABI, infuraWsUrl, SepoliaContract)
	// Prevent the main thread from exiting
	select {}
}

func EventSubscriber(contractABI abi.ABI, WsUrl string, ContractAddrHex string) {
	// Setup Infura WebSocket client

	client, err := ethclient.Dial(WsUrl)
	if err != nil {
		log.Fatalf("Failed to connect to the Infura WebSocket Ethereum client: %v", err)
	}
	// Create filter query
	contractAddress := common.HexToAddress(SepoliaContract)
	query := createFilterQuery(contractAddress, client)
	defer client.Close()

	// Setup event subscription for Infura
	subscribeToEvents(client, query, contractABI)
}

func loadABI(path string) (bookingManagementABIString string) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read ABI from file: %v", err)
	}
	bookingManagementABIString = string(data)
	return bookingManagementABIString
}
func loadContractABI() (abi.ABI, error) {
	bookingManagementABIString := loadABI(abiPath)
	return abi.JSON(bytes.NewReader([]byte(bookingManagementABIString)))
}

func createFilterQuery(contractAddress common.Address, client *ethclient.Client) ethereum.FilterQuery {
	header, err := client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to fetch the latest block number: %v", err)
	}
	fmt.Printf("start listening from latest block number: %d\n", header.Number)
	eventSignature := crypto.Keccak256Hash([]byte("AccessGranted(uint256,address,uint256)"))
	return ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
		FromBlock: header.Number, // start listening from latest block
		ToBlock:   nil,
		Topics:    [][]common.Hash{{eventSignature}},
	}
}

func subscribeToEvents(client *ethclient.Client, query ethereum.FilterQuery, contractABI abi.ABI) {
	logsChan := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logsChan)
	if err != nil {
		log.Fatalf("Failed to subscribe to contract events: %v", err)
	}
	defer sub.Unsubscribe()

	for {
		select {
		case err := <-sub.Err():
			log.Fatal(err)
		case vLog := <-logsChan:
			fmt.Println("Log received:", vLog)
			parseEventLog(vLog, contractABI)
		}
	}
}
